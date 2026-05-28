import { formatDateTime } from '@/lib/utils'

interface WaitlistPromotionProps {
  firstName: string
  lastName: string
  eventTitle: string
  eventDate: string
  eventLocation: string | null
  cancellationUrl: string
}

export function waitlistPromotionHtml(p: WaitlistPromotionProps) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#D2A2FF;padding:4px 0;border-radius:8px 8px 0 0"></div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:32px">
    <h1 style="font-size:22px;margin-top:0">Ein Platz ist frei geworden!</h1>
    <p>Hallo ${p.firstName} ${p.lastName},</p>
    <p>du warst auf der Warteliste für <strong>${p.eventTitle}</strong> — und ein Platz ist frei geworden. Du bist jetzt automatisch angemeldet!</p>
    <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:24px 0">
      <p style="margin:0 0 8px"><strong>Termin:</strong> ${formatDateTime(p.eventDate)}</p>
      ${p.eventLocation ? `<p style="margin:0"><strong>Ort:</strong> ${p.eventLocation}</p>` : ''}
    </div>
    <p>Falls du doch nicht kommen kannst:</p>
    <a href="${p.cancellationUrl}" style="display:inline-block;background:#0042C2;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">Buchung stornieren</a>
    <p style="margin-top:32px;color:#666;font-size:14px">Wir freuen uns auf dich!</p>
  </div>
</body>
</html>`
}

export function waitlistPromotionText(p: WaitlistPromotionProps) {
  return `Hallo ${p.firstName} ${p.lastName},

du warst auf der Warteliste für "${p.eventTitle}" — ein Platz ist frei geworden, du bist jetzt automatisch angemeldet!

Termin: ${formatDateTime(p.eventDate)}
${p.eventLocation ? `Ort: ${p.eventLocation}` : ''}

Zum Stornieren: ${p.cancellationUrl}

Wir freuen uns auf dich!`
}
