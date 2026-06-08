CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT INTO settings (key, value) VALUES
  ('agb', ''),
  ('datenschutz', '');

GRANT ALL ON TABLE settings TO service_role;
