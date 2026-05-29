import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { asunto, mensaje } = body as { asunto?: string; mensaje?: string }

  if (!asunto?.trim() || !mensaje?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Asunto y mensaje son requeridos.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuración de correo no disponible.' })
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'Digity Contacto <noreply@digity.com.mx>',
    to: ['hola@digity.com.mx'],
    subject: asunto.trim(),
    html: `<p style="white-space:pre-wrap">${mensaje.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`,
  });

  if (error) {
    throw createError({ statusCode: 502, statusMessage: error.message });
  }

  return { ok: true };
})
