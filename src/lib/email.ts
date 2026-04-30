const BREVO_API_KEY = process.env.BREVO_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "info@dimensionsedgeest.com";
const SUPER_USER_EMAIL = process.env.SUPER_USER_EMAIL || "emad.m@dimensionsedgeest.com";

async function send(to: string, subject: string, html: string) {
  if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY not set");
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Dimensions Edge", email: NOTIFY_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) throw new Error(`Brevo error: ${await res.text()}`);
}

export async function sendVerificationCode(action: "CREATE_USER" | "DELETE_USER", code: string, context: string) {
  const actionLabel = action === "CREATE_USER" ? "add a new user" : "delete a user";
  await send(
    SUPER_USER_EMAIL,
    `Verification code: ${code}`,
    `<h2>Admin Action Verification</h2>
     <p>A request was made to <strong>${actionLabel}</strong>:</p>
     <p style="color:#555">${context}</p>
     <p>Your verification code is:</p>
     <h1 style="letter-spacing:0.3em;color:#1e3a5f">${code}</h1>
     <p style="color:#888">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
     <p style="color:#888">If you did not request this, ignore this email.</p>`,
  );
}

export async function sendWelcomeEmail(to: string, name: string, tempPassword: string) {
  await send(
    to,
    "Welcome to Dimensions Edge Admin",
    `<h2>Welcome, ${name}!</h2>
     <p>An admin account has been created for you on the Dimensions Edge admin panel.</p>
     <p><strong>Login URL:</strong> <a href="https://dimensionsedgeest.com/admin">dimensionsedgeest.com/admin</a></p>
     <p><strong>Email:</strong> ${to}</p>
     <p><strong>Temporary password:</strong> <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px;font-size:1.1em">${tempPassword}</code></p>
     <p>Please log in and change your password immediately from your profile settings.</p>`,
  );
}

export async function sendPasswordResetEmail(to: string, name: string, tempPassword: string) {
  await send(
    to,
    "Your password has been reset",
    `<h2>Password Reset</h2>
     <p>Hi ${name}, your admin panel password has been reset by an administrator.</p>
     <p><strong>New temporary password:</strong> <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px;font-size:1.1em">${tempPassword}</code></p>
     <p>Please log in and change your password immediately.</p>`,
  );
}
