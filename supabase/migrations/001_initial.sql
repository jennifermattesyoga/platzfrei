-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  max_spots INTEGER NOT NULL DEFAULT 10,
  price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  cancellation_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_cancellation_token ON bookings(cancellation_token);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Allow public read of event images
CREATE POLICY "Public read event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

-- Allow service role to manage event images (handled server-side)
CREATE POLICY "Service role manages event images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'event-images');

-- RLS: events are publicly readable
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);

-- Grant table access to service_role (bypasses RLS but still needs explicit grants)
GRANT ALL ON TABLE events TO service_role;
GRANT ALL ON TABLE bookings TO service_role;

-- RLS: bookings only via service role (all mutations happen server-side)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
