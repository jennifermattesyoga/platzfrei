export type EventStatus = 'active' | 'cancelled'
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlist'

export interface Event {
  id: string
  title: string
  description: string | null
  image_url: string | null
  start_date: string
  end_date: string | null
  location: string | null
  max_spots: number
  price: number | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  event_id: string
  first_name: string
  last_name: string
  email: string
  status: BookingStatus
  cancellation_token: string
  created_at: string
}

export interface EventWithBookingCount extends Event {
  confirmed_count: number
  waitlist_count: number
}
