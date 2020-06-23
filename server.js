/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const superagent = require("superagent");
const { response, request } = require("express");

// this references the .env file and spits out the port
const PORT = process.env.PORT || 3000;
//Starts up express server
const app = express();
//tells server to use the cors library
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Callback function
app.get("/", (request, response) => {
  response.send(`PORT ${PORT} is running`);
});

app.get("/location", (request, response) => {
  const API = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json`;

  superagent
    .get(API)
    .then((data) => {
      let locationObj = new Location(data.body[0], request.query.city);
      response.status(200).send(locationObj);
    })
    .catch(() => {
      response.status(500).send(console.log("this is not working "));
    });
});

app.get("/weather", (request, response) => {
  console.log("request delivered", request.query);
  // const coordinates = {
  //   lat: request.query.latitude,
  //   lon: request.query.longitude,
  // };

  // const API = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${coordinates.lat}&long=${coordinates.lon}&days=8&key=${process.env.WEATHER_API_KEY}`;

  const API = `https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=${process.env.WEATHER_API_KEY}`;
  superagent //returned promise
    .get(API)
    // .set("api-key", process.env.WEATHER_API_KEY)
    .then((dataResults) => {
      console.log("please give me results", dataResults);
      let results = dataResults.body.data.map((result) => {
        //TODO: data is 'undefined'
        // console.log(
        //   "weather results are here +++++++++++++++++====++++++++++++++++++",
        //   // weatherResult.weather.description
        // );
        return new Weather(result);
      });
      response.status(200).json(results); //this is the actual promise
    })
    .catch((err) => {
      console.error("Weather api is not working", err);
    });
});

// app.get("/weather", (request, response) => {
//   let weatherData = require("./data/weather.json"); //one big json object

//   const results = weatherData.data.map((result) => {
//     // each index of the weather data we take it, pass it, and instantiate a new instance of the Weather obj
//     return new Weather(result);
//   });
//   response.status(200).json(results); // results has all of the weather data......entire collection of objects gets turned into json and sent as a valid json object to the client
// });

function Location(obj, city) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.formatted_query = obj.display_name;
  this.search_query = city;
}

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}

app.get("/trails", (request, response) => {
  // console.log("Trail request delivered", request.query);
  const API = `https://www.hikingproject.com/data/get-trails?key=200809744-65dfad75539efea1ea6436a215fe5a30&lat=40.0274&lon=-105.2519&maxDistance=10`;

  superagent.get(API).then((data) => {
    console.log("data please", data.body);
  });
  // response.status.json(results);
});
//app.put(), app.delete(), app.post()
app.use("*", (request, response) => {
  // custom message that tells users that eh route does not exist
  response.status(404).send(" 404 error: provide a valid route");
});

// error handler
app.use((error, request, response, next) => {
  response.status(500).send(" 500 error: your server is broken");
});
