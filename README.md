# City Explorer
[Deployed site backend](https://chris-city-explorer.herokuapp.com) <br>
[Deployed frontend](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/)


# Project Name

**Author**: Chris Bortel
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview

City Explorer is an application that allows users to search for a city and get information about the city. This information includes extended weather forcasts, nearbye hiking trails, restaurants, and movies based in that city. User types in the desired city, the server is contacted, checks to see if it has the information required, and then either requests the data from an api or from the database. That information is sent to the client to be rendered to the DOM. Also uses Node, Npm, Express, Postgress, and Superagent.

## Getting Started

To contribute to this project 

- Clone this repository
- Install the required dependencies
- Request the following api keys
  - [Geocoding API Docs](https://locationiq.com/)
  - [Weather Bit](https://www.weatherbit.io/)
  - [Movie DB](https://developers.themoviedb.org/3/getting-started/introduction)
  - [The Hiking Project](https://www.hikingproject.com/data)
  - [Yelp](https://www.yelp.com/developers/documentation/v3/business_search)
- Run server on localhost:3000 with ```nodemon server.js```
- Use your localhost to test the application in the [Codefellow City Explorer deployed frontend](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/)



<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

This is a node based application that uses superagent to retrieve data from the assorted APIs, uses postgress SQL for storing the API data in a database for future access. For the frontend, this application uses Mustache.js, jQuery, JavaScript, HTML5, and CSS3. 

## Change Log

<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples: -->

06-18-2020 | 4:15 
- Application has a fully-functional express server, with a GET route for the location resource. It is grabbing the data from the location.json file. Response request cycle.

06-18-2020 | 9:30PM 
- Application is recieving requests from client and responding with properly formatted json objects of the location data that is expected, the search query is also functional. John and Ray walked me through the search query magic.

06-19-2020 | 9:30PM 
- Application is recieving requests from client and responding with properly formatted json objects of the weather data that is expected. --- Skyler helped me spot some bug in my weather route.

06-20-2020 2:00PM 
- Application is setup with the location API and allowing user to search by the name of the city.

06-24

06-25-2020
Lab-08 | Feature #1 | DataBase

- Database is set up with schema files and working sql queries.

06-29-2020 | Lab-08 | Feature #2 | Server
- Server checks communicates to database to check for queried location, if the data is there, it is sent to the client. Otherwise, the server will make a call to the API and then send the response to the client for proper rendering.

7-5-2020
- Server is recieving a request from the front end based on the users query, sends a request to the api, gets a response, and then sends it back the the front end to be rendered by the client. Pagination is also functioning.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

John Cokos


Codefellos TA staff


Davee Sok



## User Acceptance Tests

- Number and name of feature: lab-06 Feature #1 - Repository Set Up
- Estimate of time needed to complete: 2.5 hours
- Start time: 12:00 PM
- Finish time: 3:30 PM
- Actual time needed to complete: 3.5 hours

* Number and name of feature: lab-06 Feature #2 - Locations
* Estimate of time needed to complete: 2 hours
* Start time: 6:30 PM
* Finish time: 9:30 PM
* Actual time needed to complete: 3 hours

- Number and name of feature: lab-06 Feature #3 - Weather
- Estimate of time needed to complete: 2 hours
- Start time: 12:00 PM
- Finish time: 3:00 PM
- Actual time needed to complete: 3 hours

* Number and name of feature: lab-07 Feature #1 and #2 - Weather
* Estimate of time needed to complete: 2 hours
* Start time: 12:30 PM
* Finish time: 2:00 PM
* Actual time needed to complete: 1.5 hours

- Lab 07 | Feature #4 | Trails
- Estimate
- Start time:
- Finish time
- Actual time

* Lab 08 | Feature #1 | Database
* Estimate: 1hr
* Start time: 7:00 PM
* Finish time: 7:45 PM
* Actual time45 minutes

- Lab 08 | Feature #2 | Server
- Estimate: 4hr
- Start time: N/A
- End time: N/A
- Actual time: 8hr +

* Lab 09 | Feature #1, 2, 3 | Server
* Estimate: 4hr
* Start time: N/A
* End time: N/A
* Actual time: 6hr +
