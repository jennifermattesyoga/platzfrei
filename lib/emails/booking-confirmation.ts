import { formatDateTime } from '@/lib/utils'

interface BookingConfirmationProps {
  firstName: string
  lastName: string
  eventTitle: string
  eventDate: string
  eventLocation: string | null
  cancellationUrl: string
  price: number | null
}

export function bookingConfirmationHtml(p: BookingConfirmationProps) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#D2A2FF;padding:4px 0;border-radius:8px 8px 0 0"></div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:32px">
    <h1 style="font-size:22px;margin-top:0">Buchungsbestätigung</h1>
    <p>Hallo ${p.firstName} ${p.lastName},</p>
    <p>deine Buchung für <strong>${p.eventTitle}</strong> ist bestätigt.</p>
    <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:24px 0">
      <p style="margin:0 0 8px"><strong>Termin:</strong> ${formatDateTime(p.eventDate)}</p>
      ${p.eventLocation ? `<p style="margin:0 0 8px"><strong>Ort:</strong> ${p.eventLocation}</p>` : ''}
      ${p.price ? `<p style="margin:0"><strong>Preis:</strong> ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(p.price)}</p>` : ''}
    </div>
    <p>Falls du den Termin nicht wahrnehmen kannst, kannst du deine Buchung hier stornieren:</p>
    <a href="${p.cancellationUrl}" style="display:inline-block;background:#0042C2;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">Buchung stornieren</a>
    <p style="margin-top:32px;color:#666;font-size:14px">Wir freuen uns auf dich!</p>
  </div>
</body>
</html>`
}

export function bookingConfirmationText(p: BookingConfirmationProps) {
  return `Hallo ${p.firstName} ${p.lastName},

deine Buchung für "${p.eventTitle}" am ${formatDateTime(p.eventDate)} ist bestätigt.
${p.eventLocation ? `\nOrt: ${p.eventLocation}` : ''}
${p.price ? `Preis: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(p.price)}` : ''}

Zum Stornieren: ${p.cancellationUrl}

Wir freuen uns auf dich!`
}
