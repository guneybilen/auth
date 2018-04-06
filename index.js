// This is the main starting point of the applicaton.
// to start type in the terminal: node index.js

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// app is the brains of our entire application.
const app = express();

const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://127.0.0.1:27017/auth');

// App Setup
// getting express to wotk we want it to...
// registering morgan and body-parser as middlewares.
// mmorgan is a logging framework. 
// logs incoming request to the terminal
// mostly used for debugging.
// body-parser parses the incoming requests to json
// no matter what the request type is, as configured here.
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);


// Server Setup
// getting our express app to talk to the outside world...
const port = process.env.PORT || 3090;

// http forwards any request that is coming to the express
const server = http.createServer(app);

server.listen(port);
console.log('Server listening on:', port);