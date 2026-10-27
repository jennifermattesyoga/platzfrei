import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

// Event-Zeiten werden als Wandzeit gespeichert (Formular sendet ohne Zeitzone, DB speichert als UTC).
// Darum immer die UTC-Komponenten anzeigen, damit Server (UTC) und Browser (lokal) dasselbe rendern.
function wallClock(dateStr: string) {
  const d = parseISO(dateStr)
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes())
}

export function formatDate(dateStr: string) {
  return format(wallClock(dateStr), 'EEEE, d. MMMM yyyy', { locale: de })
}

export function formatTime(dateStr: string) {
  return format(wallClock(dateStr), 'HH:mm', { locale: de })
}

export function formatDateTime(dateStr: string) {
  return format(wallClock(dateStr), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
