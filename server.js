/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const superagent = require("superagent");
const { response } = require("express");

// this references the .env file and spits out the port
const PORT = process.env.PORT || 3000;

//Starts up express server
const app = express();

//tells server to use the cors library
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// a callback function that is run when we run a route
//request and response are the parameters.
app.get("/", (request, response) => {
  response.send(`PORT ${PORT} is running`);
});

app.get("/location", (request, response) => {
  const API = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json`;

  superagent
    .get(API)
    .then((data) => {
      let locationObj = new Location(data.body[0], request.query.city); //query is an object
      // console.log(request);
      //the response sends the data that the client wants
      response.status(200).send(locationObj);
    })
    .catch(() => {
      response.status(500).send(console.log("this is not working "));
    });
});

function Location(obj, city) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.formatted_query = obj.display_name;
  this.search_query = city;
}

app.get("/weather", (request, response) => {
  let weatherData = require("./data/weather.json"); //one big json object

  const results = weatherData.data.map((result) => {
    // each index of the weather data we take it, pass it, and instantiate a new instance of the Weather obj
    return new Weather(result);
  });
  response.status(200).json(results); // results has all of the weather data......entire collection of objects gets turned into json and sent as a valid json object to the client
});

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
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
