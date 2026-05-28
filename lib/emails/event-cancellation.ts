import { formatDateTime } from '@/lib/utils'

interface EventCancellationProps {
  firstName: string
  lastName: string
  eventTitle: string
  eventDate: string
  isWaitlist?: boolean
}

export function eventCancellationHtml(p: EventCancellationProps) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#D2A2FF;padding:4px 0;border-radius:8px 8px 0 0"></div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:32px">
    <h1 style="font-size:22px;margin-top:0">Termin abgesagt</h1>
    <p>Hallo ${p.firstName} ${p.lastName},</p>
    <p>leider müssen wir dir mitteilen, dass der Termin <strong>${p.eventTitle}</strong> am ${formatDateTime(p.eventDate)} abgesagt wurde.</p>
    ${p.isWaitlist ? '<p>Du warst auf der Warteliste für diesen Termin.</p>' : ''}
    <p style="color:#666;font-size:14px">Wir entschuldigen uns für die Unannehmlichkeiten und hoffen, dich bald bei einem anderen Termin begrüßen zu dürfen!</p>
  </div>
</body>
</html>`
}

export function eventCancellationText(p: EventCancellationProps) {
  return `Hallo ${p.firstName} ${p.lastName},

leider wurde der Termin "${p.eventTitle}" am ${formatDateTime(p.eventDate)} abgesagt.
${p.isWaitlist ? '\nDu warst auf der Warteliste für diesen Termin.' : ''}

Wir entschuldigen uns für die Unannehmlichkeiten!`
}
