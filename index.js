Author = require('./models/author');
Book = require('./models/book');
City = require('./models/city');
School = require('./models/school');
Class = require('./models/class');
Teacher = require('./models/teacher');
Student = require('./models/student');
Parent = require('./models/parent');
Notification = require('./models/notification');
Attendance = require('./models/attendance');
Resource = require('./models/resource');
Application = require('./models/application');
Notifmap = require('./models/notifmap');


/*
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
  var mongo = require('mongodb');
  //const MongoClient = mongo.MongoClient;

  const MongoClient = require('mongodb').MongoClient
 
  console.log("yipee app man uri: ");
var db


MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
  console.log("Connected correctly to server");

  db.close();
});
   
 mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

mongo.Db.connect(process.env.MONGODB_URI, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});

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
*/

var mongoose = require('mongoose');
var mongodbUri = require('mongodb-uri');
var bodyParser = require('body-parser');
var async = require("async");
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 

// A MongoDB URI, not compatible with Mongoose because it lists multiple hosts in the address
// Could be pulled from an environment variable or config file
var uri = 'mongodb://ShivamP123:darkfox123@ds153709.mlab.com:53709/digitalhomaelandtest';

app.set('port', (process.env.PORT || 5000));

// Reformat to a Mongoose connect string and connect()
var mongooseConnectString = mongodbUri.formatMongoose(uri);
mongoose.connect(mongooseConnectString);

// Test for connection success
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function callback () {
    console.log('Successfully connected to MongoDB ');
});



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

// setup route for lANDING PAGE
app.get('/api', function(req,res){
    res.send("Hello World!");
});

app.get('/api/cities', function(req, res){
    var result = "{\"cities\":["
    City.getCities(function(err, cities){
       if(err){
           throw err;
       } 
        /*
		cities.forEach(function(city){
            result += "{\"name\":\"" + city.name + "\"," + "\"schools\":\"" + city.schools + "\"},"; 
        })
        result = result.substr(0, result.length-1);
        result +="]}";
        res.json(JSON.parse(result));
		*/
		res.json(cities);
    });
});

//Add city
app.post('/api/cities', function(req, res){
    var city = req.body.city;
    City.addCity(city, function(err, city){
       if(err){
           throw err;
       } 
        res.json(city);
    });
});


//Add city manually
var authOrigin = new Author({
	first_name:"Shivam",
	family_name:"Pathak"
});

authOrigin.save(function(err){
  if ( err ) throw err;
  console.log("Shivam name Saved Successfully");
});

/*
var cityOrigin = new City({
	name:"Bareilly"
});

cityOrigin.save(function(err){
  if ( err ) throw err;
  console.log("Lucknow name Saved Successfully");
});
*/

// clean up code 
/*
City.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
*/