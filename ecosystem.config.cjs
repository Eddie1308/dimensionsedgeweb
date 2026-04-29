// PM2 ecosystem file for the aaPanel deployment.
// Run with:  pm2 start ecosystem.config.cjs --env production
// Reload:    pm2 reload dimensionsedge
// Logs:      pm2 logs dimensionsedge

module.exports = {
  apps: [
    {
      name: "dimensionsedge",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: "max", // one per CPU core; PM2 cluster mode
      exec_mode: "cluster",
      max_memory_restart: "512M",
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      // Logs land in ~/.pm2/logs by default; aaPanel surfaces these.
      output: "logs/out.log",
      error: "logs/error.log",
      time: true,
    },
  ],
};
