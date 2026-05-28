import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

export function formatDate(dateStr: string) {
  return format(parseISO(dateStr), 'EEEE, d. MMMM yyyy', { locale: de })
}

export function formatTime(dateStr: string) {
  return format(parseISO(dateStr), 'HH:mm', { locale: de })
}

export function formatDateTime(dateStr: string) {
  return format(parseISO(dateStr), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
