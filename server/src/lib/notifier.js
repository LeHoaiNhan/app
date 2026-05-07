import nodemailer from 'nodemailer'

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  MAIL_FROM = 'eVisa <no-reply@evisa.local>',
  APP_URL,
  CORS_ORIGIN,
} = process.env

const APP_BASE = (APP_URL || (CORS_ORIGIN || '').split(',')[0] || 'http://localhost:5173').replace(/\/$/, '')

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

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
))
const fmtDate = (s) => {
  if (!s) return '—'
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? esc(s) : d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
}
const fmtMoney = (n, cur = 'USD') => `${cur} ${Number(n || 0).toFixed(2)}`

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

export async function notifyCustomMessage({ to, subject, message, order }) {
  if (!to) return
  const text = `${message}

${order ? `Order: ${order.id} — ${order.destination}` : ''}

— eVisa Team`
  return send({ to, subject, text })
}

export async function notifyOrderConfirmation(order) {
  const email = order.applicant?.email
  if (!email) return
  const fee = order.fee || {}
  const cur = fee.currency || 'USD'
  const trackingUrl = `${APP_BASE}/my-orders`
  const supportUrl = `${APP_BASE}/support`
  const subject = `[eVisa] We received your application — ${order.id}`

  const summary = [
    ['Applicant',       order.applicant?.fullName],
    ['Email',           order.applicant?.email],
    ['Destination',     `${order.flag || ''} ${order.destination || ''}`.trim()],
    ['Visa type',       order.visaType],
    ['Processing',      order.processing],
    ['Entry → Exit',    `${fmtDate(order.trip?.entryDate)} → ${fmtDate(order.trip?.exitDate)}`],
    ['Passport No.',    order.passport?.no],
  ]

  const text =
`Hi ${order.applicant?.fullName || ''},

Thanks for your application — we've received it and payment was successful.

Order code: ${order.id}
Destination: ${order.destination}
Visa type:   ${order.visaType}
Processing:  ${order.processing}
Total paid:  ${fmtMoney(fee.total, cur)}

What happens next:
  1. Our team reviews your application (within 24h)
  2. We submit it to the destination's immigration authority
  3. You receive your e-visa PDF by email once approved

Track your order any time: ${trackingUrl}
Need help?              ${supportUrl}

— eVisa Team`

  const rows = summary.filter(([,v]) => v).map(([l,v]) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;">${esc(l)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #F3F4F6;color:#111827;font-size:14px;font-weight:600;text-align:right;">${esc(v)}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><body style="margin:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1F2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:white;border-radius:14px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.05);">
        <tr><td style="background:#0B1D3A;padding:22px 28px;color:white;font-weight:800;font-size:18px;font-family:Georgia,serif;">eVisa</td></tr>
        <tr><td style="padding:28px 28px 8px;">
          <div style="display:inline-block;background:#F0FDF4;border:1px solid #BBF7D0;color:#15803D;font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;">✓ Application received</div>
          <h1 style="font-size:22px;font-weight:800;color:#0B1D3A;margin:14px 0 8px;line-height:1.3;">Hi ${esc(order.applicant?.fullName || 'there')}, your application is in.</h1>
          <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0 0 18px;">Payment was successful and your file is queued for review. Save this email — your order code is your tracking key.</p>
        </td></tr>
        <tr><td style="padding:0 28px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3FF;border-radius:10px;padding:16px;">
            <tr>
              <td>
                <div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;">Order code</div>
                <div style="font-family:'SF Mono',Menlo,monospace;font-size:22px;font-weight:800;color:#0B1D3A;margin-top:4px;">${esc(order.id)}</div>
              </td>
              <td align="right">
                <div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;">Total paid</div>
                <div style="font-size:20px;font-weight:800;color:#1B4FD8;margin-top:4px;">${esc(fmtMoney(fee.total, cur))}</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 8px;">
          <h2 style="font-size:13px;color:#0B1D3A;font-weight:700;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px;">Order summary</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;">${rows}</table>
        </td></tr>
        <tr><td style="padding:18px 28px 6px;">
          <h2 style="font-size:13px;color:#0B1D3A;font-weight:700;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px;">What happens next</h2>
          <ol style="padding-left:18px;margin:0;color:#374151;font-size:14px;line-height:1.7;">
            <li>Our team reviews your application — usually within 24 hours.</li>
            <li>We submit it to the destination's immigration authority.</li>
            <li>You receive your e-visa PDF by email as soon as it's approved.</li>
          </ol>
        </td></tr>
        <tr><td align="center" style="padding:22px 28px 28px;">
          <a href="${esc(trackingUrl)}" style="display:inline-block;background:#1B4FD8;color:white;text-decoration:none;font-weight:700;font-size:14px;padding:12px 26px;border-radius:8px;">Track my order →</a>
          <div style="margin-top:10px;font-size:12px;color:#9CA3AF;">or visit <a href="${esc(supportUrl)}" style="color:#1B4FD8;text-decoration:none;">${esc(supportUrl)}</a> with your code</div>
        </td></tr>
        <tr><td style="background:#F9FAFB;padding:18px 28px;text-align:center;font-size:11px;color:#9CA3AF;border-top:1px solid #E5E7EB;">
          You received this email because an application was submitted under ${esc(email)}. If this wasn't you, please <a href="${esc(supportUrl)}" style="color:#1B4FD8;text-decoration:none;">contact support</a>.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`

  return send({ to: email, subject, html, text })
}

export async function notifySupportReply(message) {
  if (!message.email || !message.reply) return
  const subject = `[eVisa] Re: ${message.subject || 'Your support request'}`
  const text = `Hi ${message.name},

${message.reply}

— eVisa Support`
  return send({ to: message.email, subject, text })
}
