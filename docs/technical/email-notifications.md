# Notificaciones por correo

La plataforma envia un correo de bienvenida cuando un estudiante crea su cuenta.

## Variables necesarias en Netlify

```env
RESEND_API_KEY=
EMAIL_FROM=Study by EAPA <onboarding@tudominio.com>
EMAIL_REPLY_TO=
NEXT_PUBLIC_SITE_URL=https://studybyeapa.netlify.app
```

`EMAIL_REPLY_TO` es opcional.

## Asunto del correo

```text
Bienvenido a Study by EAPA - tu cuenta esta lista
```

## Comportamiento

- El correo se envia desde el backend despues de crear la cuenta.
- La clave de Resend nunca se expone al navegador.
- Si el correo falla, la cuenta del estudiante se crea de todos modos y el error queda en los logs del servidor.
