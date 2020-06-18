"use strict";

// dotenv, expres, cors
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// this is the magic that john was talking about
// anything from .env file wih show up here
const PORT = process.env.PORT;

//get an 'inastance of express as out app
//app turns the server on
const app = express();

app.use(cors()); //lets express function use other stuff...Dont worry about what it does

//Route on the "/" in the url bar of the browser
//request and response are the parameters. Response: has methods that send data
app.get("/", (request, response) => {
  response.send("OK, you got it");
});

app.listen(PORT, () => console.log("Server running on port", PORT));

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
