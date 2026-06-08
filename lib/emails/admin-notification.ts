import { formatDateTime } from '@/lib/utils'

interface AdminNotificationProps {
  eventTitle: string
  eventDate: string
  firstName: string
  lastName: string
  email: string
  status: 'confirmed' | 'waitlist' | 'cancelled'
  confirmedCount: number
  maxSpots: number
}

export function adminNotificationHtml(p: AdminNotificationProps) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#0042C2;padding:4px 0;border-radius:8px 8px 0 0"></div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:32px">
    <h1 style="font-size:20px;margin-top:0">${p.status === 'cancelled' ? 'Stornierung' : p.status === 'waitlist' ? 'Neue Wartelisteneintragung' : 'Neue Buchung'}</h1>
    <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:16px 0">
      <p style="margin:0 0 6px"><strong>Termin:</strong> ${p.eventTitle}</p>
      <p style="margin:0 0 6px"><strong>Datum:</strong> ${formatDateTime(p.eventDate)}</p>
      <p style="margin:0 0 6px"><strong>Teilnehmer:in:</strong> ${p.firstName} ${p.lastName}</p>
      <p style="margin:0 0 6px"><strong>E-Mail:</strong> ${p.email}</p>
      <p style="margin:0"><strong>Belegung:</strong> ${p.confirmedCount}/${p.maxSpots} Plätze</p>
    </div>
  </div>
</body>
</html>`
}

export function adminNotificationText(p: AdminNotificationProps) {
  return `${p.status === 'cancelled' ? 'Stornierung' : p.status === 'waitlist' ? 'Neue Wartelisteneintragung' : 'Neue Buchung'} für "${p.eventTitle}"

Teilnehmer:in: ${p.firstName} ${p.lastName} (${p.email})
Datum: ${formatDateTime(p.eventDate)}
Belegung: ${p.confirmedCount}/${p.maxSpots} Plätze`
}
