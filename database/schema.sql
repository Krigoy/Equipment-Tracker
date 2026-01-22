-- Equipment Tracker schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Machine', 'Vessel', 'Tank', 'Mixer')),
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
  last_cleaned_date DATE NOT NULL
);


