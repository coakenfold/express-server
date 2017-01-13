'use strict';
const env = process.env.NODE_ENV || "development";
const config = require('./config')[env]; 

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Link = require('react-router').Link;
const MongoClient = require('mongodb').MongoClient;
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

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, results) => {
    console.log('results', results);
    //res.sendFile(pub + '/index.html')

    res.render('index.ejs', {quotes: results});
  })
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database');
    res.redirect('/');
  })
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
MongoClient.connect(config.database.url, (err, database) => {
  if (err) return console.log(err)

  db = database;

  // ..start the server
  http.createServer(app).listen(config.server.http);
  console.log('listening at http://localhost:' + config.server.http);

  https.createServer(options, app).listen(config.server.https);
  console.log('listening at https://localhost:' + config.server.https);

});
