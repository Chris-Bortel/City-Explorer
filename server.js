"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");
const superagent = require("superagent");

const PORT = process.env.PORT || 3000;
const app = express();
const client = new pg.Client(
  process.env.HEROKU_POSTGRESQL_BRONZE_URL || process.env.DATABASE_URL
);
app.use(cors());

// Routes
app.get("/", handleHomePage);
app.get("/location", handleLocation);
app.get("/weather", handleWeather);
app.get("/trails", handleTrails);
app.get("/movies", handleMovies);
app.get("/yelp", handleYelp);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

client
  .connect()
  .then(() => console.log("Client is connected"))
  .catch((err) => {
    throw `PG startup error: ${err.message}`;
  });

// Route Handlers
function handleHomePage(request, response) {
  response.send(`PORT ${PORT} is running`);
}

//////////// Location
function handleLocation(request, response) {
  const SQL = "SELECT * FROM locations WHERE search_query = $1";
  const city = [request.query.city];
  client
    .query(SQL, city)
    .then((result) => {
      if (result.rowCount) {
        console.log("Location is in the database");
        response.status(200).json(result.rows[0]);
      } else {
        locationAPIHandler(request.query.city, response);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
}

function locationAPIHandler(city, response) {
  const API = "https://us1.locationiq.com/v1/search.php";
  let queryObject = {
    key: process.env.GEOCODE_API_KEY,
    q: city,
    format: "json",
  };
  console.log("Getting from API");

  superagent
    .get(API)
    .query(queryObject)
    .then((data) => {
      let locationObj = new Location(data.body[0], city);
      cacheLocation(city, data.body);
      response.status(200).send(locationObj);
    })
    .catch(() => {
      response.status(500).send(console.log("Location data is not working "));
    });
}

function cacheLocation(city, data) {
  const location = new Location(data[0]);
  const queryValues = [
    city,
    location.formatted_query,
    location.latitude,
    location.longitude,
  ];
  const SQL = `
    INSERT INTO locations (search_query, formatted_query, latitude, longitude)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  return client.query(SQL, queryValues).then((results) => {
    results.rows[0];
  });
}

function Location(obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

//////////// Weather
function handleWeather(request, response) {
  const API = `https://api.weatherbit.io/v2.0/forecast/daily`;
  const queryObject = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
  };

  superagent
    .get(API)
    .query(queryObject)
    .then((dataResults) => {
      let results = dataResults.body.data.map((result) => {
        return new Weather(result);
      });
      response.status(200).json(results);
    })
    .catch((err) => {
      console.error("Weather api is not working", err);
    });
}

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = new Date(obj.datetime).toDateString();
}

//////////// Trails
function handleTrails(request, response) {
  const API = `https://www.hikingproject.com/data/get-trails?&maxDistance=10`;
  const queryObject = {
    key: process.env.TRAIL_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
  };

  superagent
    .get(API)
    .query(queryObject)
    .then((dataResults) => {
      let results = dataResults.body.trails.map((result) => {
        return new Trails(result);
      });
      response.status(200).json(results);
    })
    .catch((err) => {
      console.error("Trail api is not working", err);
    });
}

// TODO Need to put the constructor function into a model file and require appropriately.
function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionDetails;
  this.condition_date = obj.conditionDate; // TODO I need to take this item, filter it, and then return either side to its respected variable
  this.condition_time = obj.conditionDate;
}

//////////// Movies
function handleMovies(request, response) {
  const API = `https://api.themoviedb.org/3/search/movie?`;
  const queryObject = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.search_query,
  };

  superagent
    .get(API)
    .query(queryObject)
    .then((dataResults) => {
      let results = dataResults.body.results.map((result) => {
        // console.log(results);
        return new Movies(result);
      });
      response.status(200).json(results);
    })
    .catch((err) => {
      response.status(500).send("Movie route is not working");
      // console.error("Movie api is not working", err);
    });
}

function Movies(obj) {
  this.title = obj.original_title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

//////////// Yelp
function handleYelp(request, response) {
  const API = `https://api.yelp.com/v3/businesses/search`;
  const queryObject = {
    term: "restaurants",
    latitude: request.query.latitude,
    longitude: request.query.longitude,
    limit: 5,
    offset: (request.query.page - 1) * 5,
  };

  superagent
    .get(API)
    .set("Authorization", `Bearer ${process.env.YELP_API_KEY}`)
    .query(queryObject)
    .then((dataResults) => {
      let results = dataResults.body.businesses.map((result) => {
        return new Restaurants(result);
      });
      response.status(200).json(results);
    })
    .catch((err) => {
      response.status(500).send("Yelp route is not working");
    });
}

function Restaurants(obj) {
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}

app.use("*", (request, response) => {
  response.status(404).send(" 404 error: provide a valid route");
});

app.use((error, request, response, next) => {
  response.status(500).send(" 500 error: your server is broken");
});
