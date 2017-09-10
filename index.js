var express = require('express');
var app = express();
var bodyParser = require('body-parser'),
  mongoose = require('mongoose');
  var mongo = require('mongodb');

  console.log("yipee app man : " + process.env.MONGODB_URI);
  
  mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});


/*
mongo.Db.connect(process.env.MONGODB_URI, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});
*/
express()
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
  })

  
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
