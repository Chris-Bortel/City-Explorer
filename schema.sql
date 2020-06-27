DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  formatted_query VARCHAR(255),
  search_query VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);