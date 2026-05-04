function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} environment variable is required`);
  return v;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send(to: string, subject: string, html: string) {
  const apiKey = requireEnv("BREVO_API_KEY");
  const notifyEmail = process.env.NOTIFY_EMAIL || "info@dimensionsedgeest.com";
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Dimensions Edge", email: notifyEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    // Log full Brevo error server-side; don't include in thrown message that
    // could bubble up to a client.
    const detail = await res.text();
    console.error("[email] Brevo error:", detail);
    throw new Error("Email send failed");
  }
}

export async function sendVerificationCode(action: "CREATE_USER" | "DELETE_USER", code: string, context: string) {
  const superUserEmail = requireEnv("SUPER_USER_EMAIL");
  const actionLabel = action === "CREATE_USER" ? "add a new user" : "delete a user";
  await send(
    superUserEmail,
    `Verification code: ${code}`,
    `<h2>Admin Action Verification</h2>
     <p>A request was made to <strong>${actionLabel}</strong>:</p>
     <p style="color:#555">${escapeHtml(context)}</p>
     <p>Your verification code is:</p>
     <h1 style="letter-spacing:0.3em;color:#1e3a5f">${escapeHtml(code)}</h1>
     <p style="color:#888">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
     <p style="color:#888">If you did not request this, ignore this email.</p>`,
  );
}

export async function sendWelcomeEmail(to: string, name: string, tempPassword: string) {
  await send(
    to,
    "Welcome to Dimensions Edge Admin",
    `<h2>Welcome, ${escapeHtml(name)}!</h2>
     <p>An admin account has been created for you on the Dimensions Edge admin panel.</p>
     <p><strong>Login URL:</strong> <a href="https://dimensionsedgeest.com/admin">dimensionsedgeest.com/admin</a></p>
     <p><strong>Email:</strong> ${escapeHtml(to)}</p>
     <p><strong>Temporary password:</strong> <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px;font-size:1.1em">${escapeHtml(tempPassword)}</code></p>
     <p>Please log in and change your password immediately from your profile settings.</p>`,
  );
}

export async function sendPasswordResetEmail(to: string, name: string, tempPassword: string) {
  await send(
    to,
    "Your password has been reset",
    `<h2>Password Reset</h2>
     <p>Hi ${escapeHtml(name)}, your admin panel password has been reset by an administrator.</p>
     <p><strong>New temporary password:</strong> <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px;font-size:1.1em">${escapeHtml(tempPassword)}</code></p>
     <p>Please log in and change your password immediately.</p>`,
  );
}
