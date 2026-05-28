import { formatDateTime } from '@/lib/utils'

interface BookingCancellationProps {
  firstName: string
  lastName: string
  eventTitle: string
  eventDate: string
}

export function bookingCancellationHtml(p: BookingCancellationProps) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#D2A2FF;padding:4px 0;border-radius:8px 8px 0 0"></div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:32px">
    <h1 style="font-size:22px;margin-top:0">Stornierungsbestätigung</h1>
    <p>Hallo ${p.firstName} ${p.lastName},</p>
    <p>deine Buchung für <strong>${p.eventTitle}</strong> am ${formatDateTime(p.eventDate)} wurde erfolgreich storniert.</p>
    <p style="color:#666;font-size:14px">Wir hoffen, dich bei einem anderen Termin begrüßen zu dürfen!</p>
  </div>
</body>
</html>`
}

export function bookingCancellationText(p: BookingCancellationProps) {
  return `Hallo ${p.firstName} ${p.lastName},

deine Buchung für "${p.eventTitle}" am ${formatDateTime(p.eventDate)} wurde storniert.

Wir hoffen, dich bei einem anderen Termin begrüßen zu dürfen!`
}
