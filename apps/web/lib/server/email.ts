type SendWelcomeEmailInput = {
  to: string;
  fullName: string;
};

type ResendResponse = {
  id?: string;
  message?: string;
  error?: {
    message?: string;
  };
};

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "estudiante";
}

function buildWelcomeEmail({ fullName }: Pick<SendWelcomeEmailInput, "fullName">) {
  const firstName = getFirstName(fullName);
  const subject = "Bienvenido a Study by EAPA - tu cuenta esta lista";
  const preview =
    "Bienvenido a Study by EAPA. Ya puedes entrar a tu espacio de estudio.";
  const text = [
    `Bienvenido, ${firstName}.`,
    "",
    "Tu cuenta de Study by EAPA fue creada correctamente.",
    "Desde ahora puedes entrar a la plataforma, explorar los cursos disponibles y continuar tu ruta de aprendizaje.",
    "",
    "Detalle:",
    "- Plataforma: Study by EAPA",
    "- Acceso: cuenta de estudiante",
    "- Proximo paso: iniciar sesion y elegir el curso que deseas estudiar",
    "",
    "Aprende medicina facil y feliz.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f8fbff;font-family:Poppins,Inter,Arial,sans-serif;color:#0d2b5e;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #e6ebf1;border-radius:22px;padding:28px;box-shadow:0 12px 35px rgba(13,43,94,0.08);">
          <p style="margin:0 0 12px;color:#2d6cc4;font-size:13px;font-weight:700;text-transform:uppercase;">Study by EAPA</p>
          <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#0d2b5e;">Bienvenido, ${firstName}</h1>
          <p style="margin:0 0 18px;color:#64748b;font-size:16px;line-height:1.7;">${preview}</p>
          <div style="background:#f8fbff;border:1px solid #e6ebf1;border-radius:18px;padding:18px;margin:22px 0;">
            <p style="margin:0 0 8px;font-weight:700;color:#0d2b5e;">Detalle de tu inscripcion</p>
            <p style="margin:0;color:#64748b;line-height:1.7;">Tu cuenta de estudiante fue creada correctamente. Ya puedes iniciar sesion, explorar los cursos disponibles y organizar tu estudio.</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://studybyeapa.netlify.app"}/auth/login" style="display:inline-block;background:#2d6cc4;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 22px;font-weight:700;">Entrar a mi cuenta</a>
          <p style="margin:22px 0 0;color:#64748b;font-size:14px;">Aprende medicina facil y feliz.</p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export async function sendWelcomeEmail(input: SendWelcomeEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "Welcome email skipped: configure RESEND_API_KEY and EMAIL_FROM.",
    );
    return { skipped: true };
  }

  const email = buildWelcomeEmail(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
    }),
  });

  const payload = (await response.json()) as ResendResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ?? payload.message ?? "No se pudo enviar el correo.",
    );
  }

  return { id: payload.id };
}
