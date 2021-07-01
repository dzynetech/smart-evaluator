CREATE EXTENSION postgis;

-- sources schema
CREATE TABLE public.sources(
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE 
);
CREATE TYPE classification AS ENUM ('unclassified', 'construction', 'not_construction','unsure','duplicate');

-- permits schema
CREATE TABLE public.permits(
    id serial PRIMARY KEY, 
    permit_data text,
    geocode_data text,
    cost bigint,
    sqft int,
    street_number VARCHAR(16),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    formatted_address VARCHAR(255),
    source_id int,
    import_id VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    classification classification NOT NULL DEFAULT 'unclassified',
    CONSTRAINT fk_source
        FOREIGN KEY(source_id)
            REFERENCES sources(id)
);
SELECT AddGeometryColumn ('public','permits','location',4326,'POINT',2);
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




-- example of adding data using WKT
INSERT INTO
  public.permits(location)
VALUES(
    ST_GeomFromText('POINT(-71.060316 48.432044)', 4326)
  );
-- end example