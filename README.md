<a href="https://aimeos.org/">
    <img src="Gameport.svg.png" alt="gamerport logo" title="gamerport" align="right" height="80" />
</a>

GamerPort
======================

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  

:star: Star us on GitHub — it helps!

GamerPort is a platform to review & find games you love. 

## Table of Contents

- [Related Links](#features)
- [Features](#authors)
- [License](#license)
- [Setup Dev Environment](#setup-dev-environment)

## Features
- Custom User Authentication
- Game Filtering on Genre, Platform, Franchise, Company, Ratings, Release Date
- Auto Recommendations
- Searching for Games from IGDB database
- User Wishlist Tracking
- Friend Messaging & Alerts

## Authors
Gaming Gators: T Shee, E Michaud, N Michaud

## Setup Dev Environment
Frontend: HTML + CSS + Vanilla JS + Bootstrap frontend

Backend: Node.js (Express), Passport, pg-promise, and PostgreSQL

`cd server`
`npm install && npm start`

Server runs at 8080.

## License

HoloMemes is licensed under the terms of the MIT license and is available for free.

### Getting Started with Node.js + Heroku 

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

### Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

### Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
