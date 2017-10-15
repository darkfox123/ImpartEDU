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
            response += "{\"name\":\"" + school.name + "\"," + "\"city\":\"" + school.city + "\"," + "\"schoolId\":\"" + school.schoolId + "\"," + "\"classes\":\"" + school.classes + "\"},"; 
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
    //console.log(JSON.stringify(req.body))
	var reqBody = req.body;
	console.log(JSON.stringify(reqBody));
	var functionVal = reqBody.function;
    console.log("fnval : " + functionVal + " params : " + JSON.stringify(reqBody.queryparam));
    if(functionVal == "add"){
		console.log("inside add");
	var params = req.body.params;
	var classes = params.classes;
    var schoolId = params.schoolId;
    var city = params.city;
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
            console.log("return json : " + returnjson + " with counter : " + count);
            School.addClass(schoolId, classId, function( school){
              // console.log("count inner : " + count + " : " + " classes len :" + classes.length);
                if(count == (1 + classes.length)){
              //  console.log("final return : " + school);
                   var jsonObj = JSON.parse(returnjson);
             res.json(jsonObj); 
            }
               });   
    });   
});  
	}
	else if (functionVal == "fetch"){
	var params = reqBody.params;
	console.log("city : " + params.city + " : ");
    var returnJson = "";
    var count = 1;
    if(params.city != null && params.school != null){   
    Class.getClasseBySchool(params.city, params.school, function(err, classes){
     returnJson += "{\"classes\":[";
        console.log("classes : " + classes.length);
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
	}
});

//Add Teacher
//{"function":"add", "teacher" :{"schoolId":"school9927","password":"pihugolu","aadharId":"fghjklasd","section":"B","city":"Bareilly","email":"oathak.sb@gmail.com","phone":"9004890850","schoolName":"Uttam Public","firstName":"shibu","class":"IV","middleName":"nope","role":"teacher","lastName":"pathak","classId":"59cd50a41e3b90c41fc05fbc"}}
app.post('/api/teachers', function(req, res){
    var teacher = req.body.teacher;
    console.log("request body teacher : " + JSON.stringify(teacher));
	var tid= "#";
    var classId = "#";
    var returnJson = "{ \"teacherid\":\""; 
    Teacher.addTeachers(teacher, function( tId){
       //console.log("returned response : " + JSON.stringify(tId));
	   returnJson += tId + "\",\"classid\":\"";
        tid = tId;
        console.log("returned tid : " + returnJson );
         Class.addClassTeacher(tid, teacher.schoolId ,teacher.class, teacher.section, teacher.classId, function(classId){
            console.log("returned classid : " + JSON.stringify(classId));
			returnJson += classId + "\"}";
             console.log("never came back : " + returnJson);
             var jsonObj = JSON.parse(returnJson);
             res.json(jsonObj);
    });
        });
});

//Get teacher
app.get('/api/teachers', function(req, res){
    Teacher.getTeachers(function(err, teachers){
       if(err){
           throw err;
       } 
        res.json(teachers);
    });
});

//Get students
app.get('/api/students', function(req, res){
    console.log("getting students");
	Student.getStudents(function(err, students){
       if(err){
           throw err;
       } 
        res.json(students);
    });
});

//Add classes (add school prerequisite){"classId":"59cd50a41e3b90c41fc05fbc" , "students" : [{"name":"Shibu", "rollno":"121", "className":"IV", "section":"B" , "schoolName":"St. stephens", "city":"Bareilly", "schoolId": "school9927"}, {"name":"Rupa", "rollno":"122","className":"IV", "section":"B" , "schoolName":"St. stephens", "city":"Bareilly", "schoolId": "school9927"}, {"name":"Sona", "rollno":"123", "className":"IV", "section":"B" , "schoolName":"St. stephens", "city":"Bareilly", "schoolId": "school9927"}]}
// Test: {"classId":"-----" , "schoolId": "------", "students" : [{"name":"XI", "section":"E", "schoolId": "school9927"}, {"name":"VI", "section":"A","schoolId": "school9927"}, {"name":"IV", "section":"B","schoolId": "school9927"}]}
app.post('/api/students', function(req, res){
    console.log("putting students");
	var classId = req.body.classId;
    var students = req.body.students;
    //var classId = "#";
    var returnjson = "{ \"studentids\":[";
    var counter = 1;
			//while(counter <= 3){  //students.length
		Student.addStudents(students, function(returnobj){
                            returnjson += returnobj;
            console.log("student len : " + students.length);
			console.log("resturnjson without counter : " + returnjson);
            //if(counter == students.length){
                var resultObj = JSON.parse(returnjson);
                var studentids = resultObj.studentids;
                //studentids.forEach(function(student) {   
				console.log("result length : " + studentids.length);
                Class.addStudents(classId, studentids, function(){
                console.log("after class.addstudnts" + resultObj);
				res.json(resultObj);    
                }); 
				//});				
           // }
            console.log("incrementing counter to : " + counter);
            counter++;
        });
		//}
});

//Performs following functions:
// 1). Add parent and return studentlist. 
// Json: {"function":"add", "params" : {"classid":"5900a6197d29611b78dcf511", "parent":{"name":"Ritik Pathak", "email":"ritikpbhod@gmail.com", "mobile":"9927894488"}}}
// Edited Json: {"function":"add", "parent" :{"password":"pihugolu","aadharId":"fghjklasd","section":"B","city":"Bareilly","email":"ritikpbhod@gmail.com","phone":"9004890850","schoolName":"St. stephens","firstName":"Ritik","class":"IV","middleName":"nope","role":"parent","lastName":"pathak"}}

// return: "{ \"parentid\":\"5901ad2323fb1016949aee93\",\"students\":[{ \"name\":\"Shibu\",\"rollno\":\"121\",\"studentid\":\"59019066e738b307d887e52c\"},{ \"name\":\"Sona\",\"rollno\":\"123\",\"studentid\":\"59019066e738b307d887e52e\"},{ \"name\":\"Rupa\",\"rollno\":\"122\",\"studentid\":\"59019066e738b307d887e52d\"}]}"
// 2). Subscribe to a student
// Json: {"function":"subscribe", "params" : {"parentid":"5901ad2323fb1016949aee93", "studentid":"59019066e738b307d887e52c"}}
// return: {"_id":"59019066e738b307d887e52c","name":"Pihu","rollno":"1121","classid":"5900a6197d29611b78dcf511","__v":0,"notifications":[],"attendance":[]}
// 3). Unsubscribe a student (same as 2)
app.post('/api/parents', function(req, res){
    console.log("request : " + req.body.function);
    var functionVal = req.body.function;
    var params = null;
    if(functionVal == "add"){
        params = req.body.parent;
        console.log("add command recieved");
        var className = params.class;
        var section = params.section;
        var schoolName = params.schoolName;
        var city = params.city;
        var schoolId = params.schoolId;
        var parent = params;
        var returnVal = "{ \"parentid\":";
    //console.log("got header id : " + classId);
    Parent.addParents(parent, function(err, parent){
        returnVal += "\"" + parent._id + "\"," + "\"students\":[";
        console.log("class chahiye : " + returnVal);
        Student.getStudentsByClass(className, section, city, schoolName, function(err, students){
       if(err){
           throw err;
       } 
         students.forEach(function(student) { 
         returnVal += "{ \"name\":\"" + student.name + "\"," + "\"rollno\":\"" + student.rollno + "\"," + "\"studentid\":\""+ student._id + "\"},";
         });
            returnVal = returnVal.substring(0, returnVal.length-1);
            returnVal += "]}"
            console.log("return value : " + returnVal);
           res.json(returnVal);
    });
    });
    }
    else if(functionVal == "subscribe"){
        params= req.body.params;
        var parentid= params.parentid;
        var studentid = params.studentid;
        Parent.subscribeStudent(parentid, studentid, function(parent){
            console.log("got studentid  : " + studentid);
           Student.getStudents(function(err, students){
       if(err){
           throw err;
       } 
               students.forEach(function(student){
            if(student._id == studentid){ res.json(student);}
        })
               res.json({});
        //res.json(students);
    });
            /*
            Student.getStudentById(studentid, function(student){
                console.log("student : " + student);
                 res.json(parent);
            })
            */
        });
    }
    else if(functionVal == "unsubscribe"){
        var parentid= params.parentid;
        var studentid = params.studentid;
        Parent.unsubscribeStudent(parentid, studentid, function(parent){
            res.json(parent);
        });
    }
    /*
    var classId = req.body.classid;
    var parent = req.body.parent;
    console.log("got header id : " + classId);
    Parent.addParents(parent, function(err, parent){
        console.log("class chahiye : " + classId);
        Student.getStudentsByClass(classId, function(err, students){
       if(err){
           throw err;
       } 
        console.log("return value : " + students.length);
            res.json(students);
    });
    })*/
    /*
    Student.getStudentsByClass(classid, function(err, students){
       if(err){
           throw err;
       } 
        res.json(students);
    });*/
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
