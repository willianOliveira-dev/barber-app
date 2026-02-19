CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE plpgsql
IMMUTABLE
STRICT
AS $$
DECLARE
  earth_radius_km CONSTANT DOUBLE PRECISION := 6371.0;
  d_lat            DOUBLE PRECISION;
  d_lon            DOUBLE PRECISION;
  a                DOUBLE PRECISION;
  c                DOUBLE PRECISION;
BEGIN
  d_lat := RADIANS(lat2 - lat1);
  d_lon := RADIANS(lon2 - lon1);

  a := SIN(d_lat / 2) * SIN(d_lat / 2)
     + COS(RADIANS(lat1)) * COS(RADIANS(lat2))
     * SIN(d_lon / 2) * SIN(d_lon / 2);

  c := 2 * ATAN2(SQRT(a), SQRT(1 - a));

  RETURN earth_radius_km * c;
END;
$$;