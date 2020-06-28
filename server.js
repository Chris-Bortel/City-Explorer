/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");
const superagent = require("superagent");

const PORT = process.env.PORT || 3000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());

// Routes
app.get("/", handleHomePage);
app.get("/location", handleLocation);
app.get("/weather", handleWeather);
app.get("/trails", handleTrails);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Promise to the server that the client is connected
client
  .connect()
  .then(() => console.log("client is connected"))
  .catch((err) => {
    throw `PG startup error: ${err.message}`; // TODO: this is undefined?
  });

app.get("/add", (request, response) => {
  // get data from front end
  console.log(request.query.potatoes); // query is a property withing the request object which is given from the callback function for this route.
  // const searchQuery = request.query.search_query;
  // const formattedQuery = request.query.formatted_query;
  // const latitudeQuery = request.query.latitude;
  // const longitudeQuery = request.query.longitude;
  // const safeQuery = [
  //   latitudeQuery,
  //   longitudeQuery,
  //   formattedQuery,
  //   searchQuery,
  // ];
  // This
  // http://localhost:3000/add?latitude=47.8279&longitude=-122.3054&formatted_query=seattle&search_query=seattle
  // need to ma
  // Sql query line 86-98
  const SQL =
    "INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;"; // first arguement, second arg, etc.

  // give SQL query to pg agent --- go to db and make request
  // client
  //   .query(SQL, safeQuery)
  //   .then((results) => {
  //     console.log(results);
  //     // look in results for rowCount // that should give me a one,. which tells us that my insert statement worked
  //     response.status(200).json(results);
  //   })
  //   .catch((error) => {
  //     response.status(500).send(error);
  //   });
});

// In Memory Cache
let locations = {};

// Route Handlers
function handleHomePage(request, response) {
  response.send(`PORT ${PORT} is running`);
}

function handleLocation(request, response) {
  // request.query.city is what the user typed in...
  // check if the database has it with a select statement
  //figure out how I change select statement to find just the row for tacoma
  const SQL = "SELECT * FROM locations WHERE search_query = $1";
  //???????/ Am I wanting to have this be the safe query variable? ????????
  const city = [request.query.city];
  // then inside of my .then ----- that is when I do the if statement
  /////Use .rowcount to return rows affected by the last executed statement
  client
    .query(SQL, city)
    .then((result) => {
      // look in results for rowCount-----SQL method // that should give me a one,. which tells us that my insert statement worked
      if (result.rowCount) {
        console.log("location is in the database");
        response.status(200).json(result.rows[0]);
      } else {
        locationAPIHandler(request.query.city, response);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
  /////send the result to the client

  ////ELSE request data from api
  //if row is found, send it to the browser

  // if (locations[request.query.city]) {
  //   console.log("we have it already...");
  //   response.status(200).send(locations[request.query.city]);
  // } else {
  //   console.log("going to get it");
  //   locationAPIHandler(request.query.city, response);
  // }
}

// location api handler
function locationAPIHandler(city, response) {
  const API = "https://us1.locationiq.com/v1/search.php";

  let queryObject = {
    key: process.env.GEOCODE_API_KEY,
    q: city, //TODO: what is going on here? Why do I not need to use request.query.city?
    format: "json",
  };

  superagent
    .get(API)
    .query(queryObject)
    .then((data) => {
      let locationObj = new Location(data.body[0], city);
      // save the city for later

      ////TODO: this is where insert statement goes.
      // else we want to look it up in the api and send it to the database (insert into)

      // locations[city] = locationObj; ///// changing this to be the cache

      // send the city to the user
      response.status(200).send(locationObj);
    })
    .catch(() => {
      response.status(500).send(console.log("The location is not working "));
    });
}

function Location(obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

// Volatile Data -- because it changes frequently, we don't cache it.
function handleWeather(request, response) {
  const API = `https://api.weatherbit.io/v2.0/forecast/daily`;
  const queryObject = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
    // &days=8   ?????How do I do this one?
  };

  superagent //returned promise
    .get(API)
    .query(queryObject)
    .then((dataResults) => {
      let results = dataResults.body.data.map((result) => {
        return new Weather(result);
      });
      response.status(200).json(results); //this is the actual promise
    })
    .catch((err) => {
      console.error("Weather api is not working", err);
    });
}

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = new Date(obj.datetime).toDateString();
}

// Volatile Data -- because it changes frequently, we don't cache it. TODO: Does trail data change a lot?
function handleTrails(request, response) {
  const API = `https://www.hikingproject.com/data/get-trails?&maxDistance=10`; //TODO: the distance is not working

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

// TODO: Need to put the constructor function into a model file and require appropriately.
function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionDetails;
  this.condition_date = obj.conditionDate; // TODO: I need to take this item, filter it, and then return either side to its respected variable
  this.condition_time = obj.conditionDate;
}

//app.put(), app.delete(), app.post()
app.use("*", (request, response) => {
  // custom message that tells users that eh route does not exist
  response.status(404).send(" 404 error: provide a valid route");
});
// error handler
app.use((error, request, response, next) => {
  response.status(500).send(" 500 error: your server is broken");
});
