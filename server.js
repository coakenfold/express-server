var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();

var options = {
 key: fs.readFileSync(__dirname + '/server.key'),
 cert: fs.readFileSync(__dirname + '/server.crt')
}

//telling app to serve static files in ./build
app.use(express.static('./build'));

app.get('/', function(req, res){
 // send ./build/index.html
 res.sendFild(path.join(__dirname, './build', 'index.html'));
});

http.createServer(app).listen(3000);
console.log('listening at http://localhost:3000');

https.createServer(options, app).listen(3001);
console.log('listening at https://localhost:3001');
