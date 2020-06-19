/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// this references the .env file and spits out the port that we have declared
const PORT = process.env.PORT;

//declares a variable that turns the express server on
const app = express();

//tells server to use the cors library
app.use(cors());

// a callback function that is run when we run a route
//request and response are the parameters. Response: has methods that send data
//this route is giving back the location json file
app.get("/location", (request, response) => {
  let data = require("./data/location.json");
  // we need to change the array of one to what the contract expects. this is the json at index of 0
  let locationObj = new Location(data[0], request.query.city); //query is an object
  // console.log(request);
  //the response sends the data that the client wants
  response.status(200).json(locationObj);
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
  let weatherData = require("./data/weather.json");
  // console.log(data);

  let allWeather = [];
  weatherData.data.forEach((weatherObj) => {
    // weatherData.data gets me to the array that I am wanting to work with
    let weather = new Weather(weatherObj);
    console.log(allWeather);
    allWeather.push(weather);
  });
  response.status(200).json(allWeather);
});

function Weather(obj) {
  this.forcast = obj.weather.description;
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
app.listen(PORT, () => console.log("Server running on port", PORT));
