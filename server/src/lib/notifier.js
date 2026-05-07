import nodemailer from 'nodemailer'

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  MAIL_FROM = 'eVisa <no-reply@evisa.local>',
} = process.env

let transporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

async function send({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`[notifier:dev] would email ${to} — "${subject}"`)
    return { skipped: true }
  }
  return transporter.sendMail({ from: MAIL_FROM, to, subject, html, text })
}

export async function notifyOrderStatus(order, newStatus, note) {
  const email = order.applicant?.email
  if (!email) return
  const subject = `[eVisa] Order ${order.id} — ${newStatus}`
  const text = `Hi ${order.applicant?.fullName || ''},

Your order ${order.id} (${order.destination}) is now: ${newStatus}.
${note ? `Note: ${note}\n` : ''}
You can track it any time at /support — code: ${order.id}.

— eVisa Team`
  return send({ to: email, subject, text })
}

export async function notifySupportReply(message) {
  if (!message.email || !message.reply) return
  const subject = `[eVisa] Re: ${message.subject || 'Your support request'}`
  const text = `Hi ${message.name},

${message.reply}

— eVisa Support`
  return send({ to: message.email, subject, text })
}
