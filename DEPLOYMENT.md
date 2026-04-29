# Deployment Guide — Dimensions Edge

Target: aaPanel-hosted Linux server, Node.js standalone build, MySQL 8, PM2 process manager, Nginx reverse proxy.

---

## 1. Server prerequisites (one-time)

On your aaPanel server:

```bash
# Node 20+ (the project requires >= 20.11)
node -v   # must be v20.x or v22.x

# Install PM2 globally if not already present
npm install -g pm2

# MySQL 8 — provision via aaPanel UI:
#   App Store → MySQL 8.0 → Install
```

In aaPanel, create:
- A MySQL **database** named `dimensionsedge` with `utf8mb4` charset and `utf8mb4_unicode_ci` collation
- A MySQL **user** with a strong password and `ALL PRIVILEGES` on that database

```sql
-- If creating manually instead of via aaPanel UI:
CREATE DATABASE dimensionsedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'de_app'@'localhost' IDENTIFIED BY 'STRONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON dimensionsedge.* TO 'de_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## 2. Environment file

Create `/www/wwwroot/dimensionsedge/.env` on the server (do NOT commit this):

```env
DATABASE_URL="mysql://de_app:STRONG_RANDOM_PASSWORD@localhost:3306/dimensionsedge"

# Generate a fresh secret for production — do NOT reuse the dev one.
# openssl rand -base64 32
AUTH_SECRET="<paste 32-char base64 secret here>"
AUTH_URL="https://dimensionsedge.sa"

NEXT_PUBLIC_SITE_URL="https://dimensionsedge.sa"
NEXT_PUBLIC_DEFAULT_LOCALE="en"

UPLOAD_DIR="./public/uploads"
MAX_UPLOAD_SIZE_MB="10"

# Phase 5 used these for env-credential auth. After Phase 6 swap to User
# table lookup, only SEED_ADMIN_EMAIL/PASSWORD matter at first-seed time.
SEED_ADMIN_EMAIL="admin@dimensionsedge.sa"
SEED_ADMIN_PASSWORD="<TEMP — change immediately after first login>"

NODE_ENV="production"
```

---

## 3. Database migration + seed

From the project directory on the server:

```bash
npm install --omit=dev=false   # need devDeps for prisma CLI
npx prisma generate
npx prisma migrate deploy      # applies all migrations to production DB
npm run prisma:seed            # creates admin user + 7 services + site settings
```

After the first successful login as the seeded admin, **immediately**:
1. Sign out
2. Set `SEED_ADMIN_PASSWORD` in `.env` to a fresh strong value
3. Hash it: `node -e "console.log(require('bcryptjs').hashSync(process.env.SEED_ADMIN_PASSWORD, 12))"` and update the User row, OR re-run the seed
4. Restart PM2: `pm2 reload dimensionsedge`

---

## 4. Build

The build runs locally (or in CI) and produces `.next/standalone/`:

```bash
npm run build
```

Output to copy to the server (rsync or aaPanel's file manager):
```
.next/standalone/        # self-contained Node server
.next/static/            # static assets — copy into .next/standalone/.next/
public/                  # static files including /uploads — copy into .next/standalone/public/
.env                     # production env (server-only — never commit)
prisma/                  # for running migrate deploy on the server
ecosystem.config.cjs
package.json             # for npm install during seed step
```

The Next.js standalone tracer copies all needed `node_modules` into `.next/standalone/node_modules/` automatically — Sharp and the Prisma adapter are included.

---

## 5. Run with PM2

```bash
cd /www/wwwroot/dimensionsedge
pm2 start ecosystem.config.cjs --env production
pm2 save        # so PM2 auto-starts on reboot
pm2 startup     # follow the printed command to enable systemd hook
```

Useful commands:
```bash
pm2 status                  # all apps
pm2 logs dimensionsedge     # tail logs
pm2 reload dimensionsedge   # zero-downtime reload after a deploy
pm2 stop dimensionsedge     # stop
pm2 monit                   # live CPU/memory dashboard
```

---

## 6. Nginx reverse proxy

In aaPanel: **Website → Add Site → Reverse Proxy** to `http://127.0.0.1:3000`.

Or paste this into the site's nginx conf manually:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dimensionsedge.sa www.dimensionsedge.sa;

    # Redirect to HTTPS — aaPanel adds this block automatically when SSL is issued.
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dimensionsedge.sa www.dimensionsedge.sa;

    # SSL certificates managed by aaPanel — do not edit these paths manually.
    ssl_certificate     /www/server/panel/vhost/cert/dimensionsedge.sa/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/dimensionsedge.sa/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Increase client_max_body_size for image uploads.
    client_max_body_size 12M;

    # Static asset path — Nginx serves /uploads directly to skip Node.
    location /uploads/ {
        alias /www/wwwroot/dimensionsedge/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Everything else proxies to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering on;
    }

    # Don't expose dotfiles
    location ~ /\. {
        deny all;
    }
}
```

After editing the nginx conf:
```bash
nginx -t && nginx -s reload
```

---

## 7. SSL

Use **aaPanel → Website → SSL → Let's Encrypt** to issue and auto-renew. Toggle "Force HTTPS" on once issued.

---

## 8. Deploy workflow (subsequent updates)

```bash
# Local
npm run build
rsync -avz --delete .next/standalone/ user@server:/www/wwwroot/dimensionsedge/.next/standalone/
rsync -avz --delete .next/static/ user@server:/www/wwwroot/dimensionsedge/.next/standalone/.next/static/
rsync -avz --delete public/ user@server:/www/wwwroot/dimensionsedge/public/

# Server
ssh user@server
cd /www/wwwroot/dimensionsedge
npx prisma migrate deploy   # if there are new migrations
pm2 reload dimensionsedge   # zero-downtime
```

---

## 9. Post-deploy checklist

- [ ] `https://dimensionsedge.sa/` redirects to `/en`
- [ ] `https://dimensionsedge.sa/en` and `/ar` both return 200
- [ ] All 7 service detail pages render with the correct cover/icons
- [ ] All 6 visible projects show on `/en/projects`; the 2 hidden ones do not
- [ ] Contact form submits and lands in `/admin/messages`
- [ ] `/admin/login` is reachable, accepts seeded credentials, sets cookie
- [ ] Sign-in cookie has `Secure` flag (visible in browser devtools — only happens on HTTPS)
- [ ] Image upload from `/admin/projects/new` saves to `/uploads/<yyyy>/<mm>/<hex>.webp`
- [ ] Lighthouse scores: Performance ≥ 90 mobile, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] Security headers present on `/`: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`

---

## 10. Backup strategy (recommended)

**Database**: aaPanel → Database → MySQL → Backup. Schedule daily, retain 14 days.

**Uploads**: rsync `/www/wwwroot/dimensionsedge/public/uploads/` to off-host storage daily. Files are content-addressed so they're easy to deduplicate.

**Code**: tag releases in Git — `git tag v0.1.0` at handoff, future deploys reference tags rather than `main`.
