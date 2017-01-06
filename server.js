const express = require('express');
const app = express();

//telling app to serve static files in ./build ?
app.use(express.static('./build'));

app.get('/', function(req, res){
  //res.send('hello world');

  // send ./build/index.html
  res.sendFild(path.join(__dirname, './build', 'index.html'));
});

// different port then...?
app.listen(9000);
console.log('listening at http://localhost:9000')
