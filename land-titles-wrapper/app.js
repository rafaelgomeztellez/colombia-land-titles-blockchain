var express = require('express'); 
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./car_dealer')(app);

var port = (process.env.PORT || 4000);
app.listen(port, function () {
  console.log('Dealer Network services listening on port ' +port +'!');
});