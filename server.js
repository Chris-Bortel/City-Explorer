/* eslint-disable quotes */
"use strict";

// dotenv, express, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// this is the magic that john was talking about
// anything from .env file wih show up here
const PORT = process.env.PORT;

//app turns the server on with an istance of express
const app = express();

app.use(cors()); //lets express function use other stuff...Dont worry about what it does

//Route on the "/" in the url bar of the browser
//request and response are the parameters. Response: has methods that send data
app.get("/location", (request, response) => {
  let data = require("./data/location.json");
  response.status(200).json(data);
});

//app.put(), app.delete(), app.post()
app.use("*", (request, response) => {
  //this is a catch all, will make it so your server does not break
  response.status(404).send(" 404 error: what are you trying to do?");
});

//500 is bad news... app.use with a for parameter thing is an error handler
app.use((error, request, response, next) => {
  response.status(500).send(" 500 error: server is broken");
});

app.listen(PORT, () => console.log(`App is listening on ${Port}`));

//handle a request for location data
//get a city from the client
//ffetch data from an API
//adapt the data, usign a Constructor function
//send the adapted data to the client

// locatopn constructor function
// tanke is som big object, turn it into something that matches the contract

//handle a request for retaurant data
// get location info from the client (lat, logn, city-name)
//fetch data from an api
//adapt the data, using a contructor function
