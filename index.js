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

// Object - City
// Get Cities
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

//Object - School
//get schools
app.get('/api/schools', function(req, res){
    var response = "{ \"Schools\":[";
    //var response = "{\"StudentId\":\"1\",\"StudentName\":\"Rahul\",\"StudentMarks\":\"83\"}";
    //console.log("resp._headers >>>>>>>" + JSON.stringify(res._headers))
    //res.json(JSON.parse(response));
    
    School.getSchools(function(err, schools){
       if(err){
           throw err;
       } 
        schools.forEach(function(school){
            console.log("school : " + school);
            response += "{\"name\":\"" + school.name + "\"," + "\"city\":\"" + school.city + "\"," + "\"schoolId\":\"" + school.schoolId + "\"},"; 
        });
        response = response.substr(0, response.length-1);
        response +=  "]}";
        //console.log(response);
        res.json(JSON.parse(response));
    });
    
});


//Add schools
//{"function":"add", "params":{"city":"Bareilly", "school": {"name" : "RDBMS", "schoolId":"pihu9927", "city":"Bareilly"}}}
app.post('/api/schools', function(req, res){
    console.log("request : " + req.body.toString);
    var functionVal = req.body.function;
    var params = req.body.params;
    console.log("fnval : " + functionVal + " params : " + params);
    if(functionVal == "add"){
     var school = params.school;
    var cityName = params.city;
    var schoolId = "#";
    School.addSchools(school, schoolId, function( school){
       console.log("returned : " + school);
        City.addSchool(cityName, school._id, function(city){
        console.log("final callback got: " + city);
            res.json(city);
    });
    });   
    }
});

// Get class
app.get('/api/classes', function(req, res){
   /*
    var response = "[{\"StudentId\":\"1\",\"StudentName\":\"Rahul\",\"StudentMarks\":\"83\"},{\"StudentId\":\"2\",\"StudentName\":\"Rohit\",\"StudentMarks\":\"91\"}]";
    console.log("city : " + req.query.city + " : " + req.query.school);
    var returnJson = "";
    var count = 1;
    if(req.query.city != null && req.query.school != null){   
    Class.getClasseBySchool(req.query.school, req.query.city, function(err, classes){
     returnJson += "{\"classes\":["
       // console.log("classes : " + classes);
        classes.forEach(function(classInst){
           if(count != classes.length){
            returnJson += "{" + "\"name\":\"" + classInst.name + "\"," + "\"section\":\"" + classInst.section +"\"},";
                console.log("returnjson incomplete : " + returnJson);
           } else {
               returnJson += "{" + "\"name\":\"" + classInst.name + "\"," + "\"section\":\"" + classInst.section +"\"}]}";
               console.log("returnjson : " + returnJson);
               res.json(JSON.parse(returnJson));
           }
            count++;
        });     
      });
    }
*/
    
    Class.getClasses(function(err, classes){
       if(err){
           throw err;
       } 
        res.json(classes);
    });
    
});

//Add classes (add school prerequisite)
// Test: {"city":"Moradabad" , "schoolId": "school9927", "classes" : [{"name":"XI", "section":"E", "schoolId": "school9927", "schoolName":"RDBMS", "city":"Moradabad"}, {"name":"VI", "section":"A","schoolId": "school9927", "schoolName":"RDBMS", "city":"Moradabad"}, {"name":"IV", "section":"B","schoolId": "school9927" , "schoolName":"RDBMS", "city":"Moradabad"}]}
app.post('/api/classes', function(req, res){
    var classes = req.body.classes;
    var schoolId = req.body.schoolId;
    var city = req.body.city;
    var classId = "#";
    var returnjson = "{ \"classid\":[\"";
    var count = 1;
    classes.forEach(function(classInst){
        Class.addClass(classInst, classId, function( classId){
            console.log("count outer : " + count + " : " + " classes len :" + classes.length);
            if(count == classes.length ){
                returnjson += classId + "\"]}";
            }
            else
           { returnjson += classId + "\",\"";}
           count++;
            console.log("return json : " + returnjson);
            School.addClass(schoolId, classId, function( school){
              // console.log("count inner : " + count + " : " + " classes len :" + classes.length);
                if(count == (3 + classes.length)){
              //  console.log("final return : " + school);
                   var jsonObj = JSON.parse(returnjson);
             res.json(jsonObj); 
            }
                            count++;
               });   
    });   
});  
});


/*
//Add city manually
var authOrigin = new Author({
	first_name:"Shivam",
	family_name:"Pathak"
});

authOrigin.save(function(err){
  if ( err ) throw err;
  console.log("Shivam name Saved Successfully");
});
*/

// manual add - working
/*
var cityOrigin = new City({
	name:"Bareilly"
});

cityOrigin.save(function(err){
  if ( err ) throw err;
  console.log("Lucknow name Saved Successfully");
});
*/

// clean up code - working
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