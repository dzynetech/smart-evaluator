CREATE EXTENSION postgis;

--clear old tables
DROP TABLE IF EXISTS public.permits;
DROP TABLE IF EXISTS public.sources;
DROP TYPE IF EXISTS classification;
-- sources schema
CREATE TABLE public.sources(
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    description varchar(255)
);
CREATE TYPE classification AS ENUM ('unclassified', 'construction', 'not_construction','possible_construction','duplicate');

-- permits schema
CREATE TABLE public.permits(
    id serial PRIMARY KEY, 
    cost real,
    sqft real,
    street_number VARCHAR(16),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(16),
    issue_date DATE,
    formatted_address VARCHAR(255),
    location_accuracy real,
    image_url VARCHAR(255),
    source_id int,
    import_id VARCHAR(16) NOT NULL,
    classification classification NOT NULL DEFAULT 'unclassified',
    notes text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data jsonb,
    permit_data jsonb,
    geocode_data jsonb,
    CONSTRAINT fk_source
        FOREIGN KEY(source_id)
            REFERENCES sources(id)
);
SELECT AddGeometryColumn ('public','permits','location',4326,'POINT',2);
ALTER TABLE public.permits ADD COLUMN has_location boolean GENERATED ALWAYS AS (location is not NULL) STORED;
-- automatic updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
VOLATILE;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.permits 
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- end automatic updated_at timestamp
