var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();

app.use(morgan('tiny'));
app.use(bodyParser());

var port = process.env.PORT || 8080;


app.listen(port, function () {
  console.log('Listening on port ' + port);
});

routes(app, express);






