'use strict';
const env = process.env.NODE_ENV || "development";
const config = require('./config')[env]; 

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
//const {fetch, Request, Response, Headers} = require('fetch-ponyfill')();
const http = require('http');
const https = require('https');
const Link = require('react-router').Link;

const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;
const Quote = require('./model/Quote');

// React
const Route = require('react-router').Route;
const Router = require('react-router').Router;

// https options
const options = {
 key: fs.readFileSync(__dirname + config.server.key),
 cert: fs.readFileSync(__dirname + config.server.cert)
}

const pub = __dirname + '/public';

let db;
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Quote.find({}, (err, quotes) => {
    if (err) throw err;

    console.log(quotes);
    res.render('index.ejs', {quotes: quotes});
  })
});

app.post('/quotes', (req, res) => {
  let q;
  let update;

  if (req.body._method === 'PUT') {
    //PUT
    update = {};
    console.log('name',req.body.name);
    console.log('quote',req.body.quote);
    if (req.body.name !== '') {
      update.name = req.body.name;
    }
    
    if (req.body.quote !== '') {
      update.quote = req.body.quote;
    }
    
    Quote.findByIdAndUpdate(req.body.id, update, (err, user) => {
      if (err) throw err;
      res.redirect('/');
    })

  } else {
    q = new Quote({
      name: req.body.name,
      quote: req.body.quote
    });

    q.save(function(err) {
      if (err) throw err;

      res.redirect('/');
    })
  }
  
})

app.use(express.static('./public'));

// ===============================================
// To be used with server-side react:
// -----------------------------------------------
// telling app to serve static files in ./build
// -----------------------------------------------
// app.use(express.static('./build'));
// -----------------------------------------------
// Catches all urls and responds with index.html
// React-router should display the appropriate markup
// -----------------------------------------------
// app.get('/*', function (req, res) {
//  res.sendFile(path.join(__dirname, './build', 'index.html'));
// });
// ===============================================




// TODO: EXTERNALIZE & IGNORE DB CONFIG
mongoose.connect(config.database.url);

mongoose.connection.on('connected', ()=> {
  console.log('Connected to DB, starting app...');

  http.createServer(app).listen(config.server.http);
  console.log('App listening at http://localhost:' + config.server.http);

  https.createServer(options, app).listen(config.server.https);
  console.log('App listening at https://localhost:' + config.server.https);
})

mongoose.connection.on('error', (err)=>{
  console.log(err)
})

mongoose.connection.on('disconnected', ()=>{
  console.log('App disconnected from db');
})

process.on('SIGINT', ()=>{
  mongoose.connection.close(()=>{
    console.log('DB connection disconnected through app termination');
    process.exit(0);
  })
})
