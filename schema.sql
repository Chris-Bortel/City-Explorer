DROP TABLE IF EXISTS 

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  latitude NUMERIC,
  longitude NUMERIC,
  formatted_query VARCHAR(255),
  search_query VARCHAR(255)
)


