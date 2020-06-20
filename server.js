/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const superagent = require("superagent");
const { response } = require("express");

// this references the .env file and spits out the port that we have declared
const PORT = process.env.PORT || 3000;

//Starts up express server
//inokes the instance of express
const app = express();

//tells server to use the cors library
app.use(cors());

// a callback function that is run when we run a route
//request and response are the parameters. Response: has methods that send data
//this route is giving back the location json file

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
  // process.env
});

//constructor function that manipulates the data to give the client an obj that it can work with
function Location(obj, city) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.formatted_query = obj.display_name;
  this.search_query = city;
}

// weather
//build constructor function for the weather json
//need a git route
app.get("/weather", (request, response) => {
  let weatherData = require("./data/weather.json"); //one big json object

  // let allWeather = [];
  const results = weatherData.data.map((result) => {
    // each index of the weather data we take it, pass it, and instantiate a new instance of the Weather obj
    //targeting the specific collection of data that I wanted
    return new Weather(result);
    // console.log(allWeather);
  });
  response.status(200).json(results); // results contains inside of it, we have all of the weather data......entire collection of objects gets turned into json and sent as a valid json object to the client
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

//This is the server, it listens to what the client wants to do. Runs the routes.
//turns the server on. and sets up a callback funtion that says that we are running. This lets us access data.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
