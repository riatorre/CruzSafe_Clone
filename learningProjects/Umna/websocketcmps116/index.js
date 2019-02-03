var express = require('express');

// App setup
var app = express();
var server = app.listen(19002,function(){
  console.log('listening to requests on port 19002\nHello World!');
});



//static files
app.use(express.static('public'));
