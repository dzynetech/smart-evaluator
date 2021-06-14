-- permits schema
CREATE TABLE public.permits(
    id serial PRIMARY KEY, 
    permit_data text,
    cost bigint,
    sqft int,
    street_number int,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    updated_at date DEFAULT now()
);

SELECT AddGeometryColumn ('public','permits','location',4326,'POINT',2);


-- example of adding data using WKT
INSERT INTO public.permits
(location)
VALUES(2, ST_GeomFromText('POINT(-71.060316 48.432044)', 4326));