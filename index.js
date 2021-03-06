// Models
Author = require('./models/author');
Book = require('./models/book');
City = require('./models/city');
School = require('./models/school');
Admin = require('./models/admin');
Class = require('./models/class');
Teacher = require('./models/teacher');
Student = require('./models/student');
Parent = require('./models/parent');
Notification = require('./models/notification');
Attendance = require('./models/attendance');
Resource = require('./models/resource');
Application = require('./models/application');
Notifmap = require('./models/notifmap');
Period = require('./models/period');
Subject = require('./models/subject');

//variables
var mongoose = require('mongoose');
var mongodbUri = require('mongodb-uri');
var async = require("async");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));


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

/*End Points start from this point */

//Test for index
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

/*                                                    Starting objects : Definition of objects start here                                                 */

//                                                        >>>>>>>>>>>>>>OBJECT - CITY<<<<<<<<<<<<<<<
// Get Cities
app.get('/api/cities', function(req, res){
    //var result = "{\"cities\":["
    console.log("getting cities");
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
            //console.log("school : " + school);
            response += "{\"name\":\"" + school.name + "\"," + "\"city\":\"" + school.city + "\"," + "\"schoolId\":\"" + school.schoolId + "\"," + "\"classes\":\"" + school.classes + "\"},"; 
        });
        response = response.substr(0, response.length-1);
        response +=  "]}";
        //console.log(response);
        res.json(JSON.parse(response));
    });
    
});


//Add schools
//{"function":"add", "params":{"city":"Bareilly", "school": {"name" : "RDBMS", "schoolId":"pihu9927", "city":"Bareilly", "admin":""}}}
//{"function":"adminRead", "params":{"schoolId":"school9927"}}
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
    } else if(functionVal == "adminRead"){
		console.log("admin read");
		School.getSchoolById(params.schoolId, function(err, schoolR){
			if(err) throw err;
			res.json(schoolR);	
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
// Test: {"function":"add", "params":{"city":"Bareilly" , "schoolId": "school9927", "classes" : [{"name":"XI", "section":"E", "schoolId": "school9927", "schoolName":"St. stephens", "city":"Bareilly"}]}}
// Test: {"function":"fetch", "params":""}
app.post('/api/classes', function(req, res){
    //console.log(JSON.stringify(req.body))
	var reqBody = req.body;
	//console.log(JSON.stringify(reqBody.params.city));
	var functionVal = reqBody.function;
    //console.log("fnval : " + functionVal + " params : " + JSON.stringify(req.params));
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
	console.log("city : " + params.school);
    var returnJson = "";
    var count = 1;
    if(params.school != null){   
    Class.getClasseBySchool(params.school, function(err, classes){
     returnJson += "{\"classes\":[";
        console.log("classes : " + classes.length);
        classes.forEach(function(classInst){
           if(count != classes.length){
            returnJson += "{" + "\"name\":\"" + classInst.name + "\"," + "\"section\":\"" + classInst.section + "\"," + "\"classId\":\"" + classInst._id +"\"},";
                console.log("returnjson incomplete : " + returnJson);
           } else {
               returnJson += "{" + "\"name\":\"" + classInst.name + "\"," + "\"section\":\"" + classInst.section + "\"," + "\"classId\":\"" + classInst._id +"\"}]}";
               console.log("returnjson : " + returnJson);
               res.json(JSON.parse(returnJson));
           }
            count++;
        });     
      });
    }	
	}
});

//Add admin
//{"function":"add", "admin" :{"schoolId":"school9927","password":"pihugolu","aadharId":"fghjklasd","section":"B","city":"Bareilly","email":"oathak.sb@gmail.com","phone":"9004890850","schoolName":"Uttam Public","firstName":"shibu","class":"IV","middleName":"nope","role":"teacher","lastName":"pathak"}}
app.post('/api/admins', function(req, res){
    var admin = req.body.admin;
    console.log("request body teacher : " + JSON.stringify(admin));
    var returnJson = "{ \"adminId\":\""; 
    Admin.addAdmin(admin, function( adminId){
       console.log("returned response : " + JSON.stringify(adminId));
	returnJson += adminId + "\"}";
				School.addAdminToSchool(schoolId, adminId ,function(schoolId){
            console.log("returned classid : " + schoolId);
			//returnJson += adminId + "\"}";
             console.log("never came back : " + returnJson);
             var jsonObj = JSON.parse(returnJson);
             res.json(jsonObj);
    });
        });
});

//Add Teacher
//{"function":"add", "teacher" :{"schoolId":"school9927","password":"pihugolu","aadharId":"fghjklasd","section":"B","city":"Bareilly","email":"oathak.sb@gmail.com","phone":"9004890850","schoolName":"Uttam Public","firstName":"shibu","class":"IV","middleName":"nope","role":"teacher","lastName":"pathak","classId":"59cd50a41e3b90c41fc05fbc"}}
//{"function":"principalToken", "params":{"schoolId":"school9927"}}
//{"function":"adminRead", "params":{"schoolId":"pihu007"}}
app.post('/api/teachers', function(req, res){
    var func = req.body.function;
	if(func == "add"){
	var teacher = req.body.teacher;
    console.log("request body teacher : " + JSON.stringify(teacher));
	var tid= "#";
    var classId = "#";
    var returnJson = "{ \"teacherId\":\""; 
    Teacher.addTeachers(teacher, function( tId){
       //console.log("returned response : " + JSON.stringify(tId));
	   returnJson += tId + "\",\"classid\":\"";
        tid = tId;
        console.log("returned tid : " + returnJson );
         Class.addClassTeacher(tid, teacher.schoolId ,teacher.class, teacher.section, teacher.classId, function(classId){
            console.log("returned classid : " + classId);
			returnJson += classId + "\"}";
             console.log("never came back : " + returnJson);
             var jsonObj = JSON.parse(returnJson);
             res.json(jsonObj);
    });
        });
	}
	else if(func == "principalToken"){
		console.log("request principal token");
		var numbers = [0,1,2,3,4,5,6,7,8,9];
		var lowerAlphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
 for (var i = numbers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
    }
		var numRet = numbers.slice(0,8).join('');
		console.log("ho gya num shuffle : " + numRet);
        //var token = shuffleArray(numbers).slice(0,8).join('') + shuffleArray(lowerAlphabets).slice(0,8).join('');
		//var permToken = shuffleArray(token).slice(0,7).join('');
		for (var i = lowerAlphabets.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = lowerAlphabets[i];
        lowerAlphabets[i] = lowerAlphabets[j];
        lowerAlphabets[j] = temp;
    }
		var aplhaRet = lowerAlphabets.slice(0,8).join('');
		console.log("ho gya num shuffle : " + aplhaRet);
		var returnVal = "{\"token\":\"" + numRet + aplhaRet + "\"}";
		console.log("ho gya retval : " + returnVal);
		var returnJson = JSON.parse(returnVal);
		res.json(returnJson);
	}
	else if(func == "adminRead"){
		var returnVal = "[";
		var params = req.body.params;
		var schoolId = params.schoolId;
		Teacher.getTeacherBySchool(schoolId, function(err, teachers){
			 if(err){
           throw err;
       } 
        var counter = 1;
			var countLen = teachers.length;
			console.log("teachers len : " + countLen);
			teachers.forEach(function(teacher) { 
         returnVal += "{ \"firstname\":\"" + teacher.firstName + "\"," + "\"lastname\":\"" + teacher.lastName + "\"," + "\"id\":\""+ teacher._id + "\"},";
		 console.log("counter match : " + countLen + " : " + counter);
		 if(counter == countLen){
		returnVal = returnVal.substr(0, returnVal.length-1);
		returnVal += "]";
		res.json(JSON.parse(returnVal)); 
		 }
		 counter++;
		});
		});
		/*
		var returnVal = "{\"teachers\":{";
		var params = req.body.params;
		var schoolId = params.schoolId;
		Teacher.getTeachers( function( teachers){
			console.log("teachers ret : " + teachers);
			var counter = 1;
			var countLen = teachers.length;
			console.log("teachers len : " + countLen);
			teachers.forEach(function(teacher) { 
         returnVal += "{ \"firstname\":\"" + teacher.firstName + "\"," + "\"lastname\":\"" + teacher.lastName + "\"," + "\"id\":\""+ teacher._id + "\"},";
		 console.log("counter match : " + countLen + " : " + counter);
		 if(counter == countLen){
			returnVal += "}}";
		res.json(returnVal); 
		 }
		 counter++;
         });
		});
		*/
	}
});

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//Get admins
app.get('/api/admins', function(req, res){
    Admin.getAdmin(function(err, teachers){
       if(err){
           throw err;
       } 
        res.json(teachers);
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

//Add classes (add school prerequisite){ "reciever" : "add", "params": {"classId":"59f4b7cf41618f04000a0a2f" , "students" :[{"name":" Yukti", "rollno":"120", "className":"II", "section":"B" , "schoolName":"Uttam Public", "city":"Bareilly","classid":"59f4b7cf41618f04000a0a2f", "notifCount":0}]}}
// Test: {"classId":"-----" , "schoolId": "------", "students" : [{"name":"XI", "section":"E", "schoolId": "school9927"}, {"name":"VI", "section":"A","schoolId": "school9927"}, {"name":"IV", "section":"B","schoolId": "school9927"}]}
/*
app.post('/api/students', function(req, res){
    console.log("putting students");
	console.log("got params : " + req.body.reciever);
	var reciever = req.body.reciever;
    var params = req.body.params;
	var students = params.students;
    //var classId = "#";
    var returnjson = "{ \"studentids\":[";
    var counter = 1;
			console.log("counter : " + counter + " : student.len : " + students.length);
			while(counter <= students.length){  //students.length
		counter++;
		console.log("entering add students");
		Student.addStudents(students, function(returnobj){
                            returnjson += returnobj;
           // console.log("student len : " + students.length);
			//console.log("resturnjson without counter : " + returnjson);
            if(counter-1 == students.length){
                var resultObj = JSON.parse(returnjson);
                var studentids = resultObj.studentids;
				console.log("studentids : " + studentids.length + " with counter : " + counter);
                
				studentids.forEach(function(student) {   
				console.log("result length before class.addStudents : " + studentids.length + " : " + classId + " : " + studentids);
                Class.addStudents(classId, studentids, function(){
                console.log("after class.addstudnts" + resultObj);
				res.json(resultObj);    
                }); 
				});	
console.log("skipping stud");				
            }
            console.log("incrementing counter to : " + counter);
            counter++;
        });
		}
});
*/

//{ "reciever" : "add", "params": {"classId":"59f4b7cf41618f04000a0a2f" , "student" :[{"name":" Yukti", "rollno":"120", "className":"II", "section":"B" , "schoolName":"Uttam Public", "city":"Bareilly","classid":"59f4b7cf41618f04000a0a2f", "notifCount":0}]}}
//{"reciever" : "adminRead", "params": {"classId":"59f4b7cf41618f04000a0a2f"}}
app.post('/api/students', function(req, res){
	console.log("entering student : ");
	var reciever = req.body.reciever;
	var params = req.body.params;
	console.log("entering add : " + reciever);
	if(reciever == "add"){
	var classId = params.classId;
	var student = params.student;
	console.log("adding student : " + req.body.string);
	var returnjson = "{ \"studentid\":[";
	Student.addStudent(student, function(err, student){
        if(err){throw err;}
        console.log("student created : " + student.string);
		Class.addStudent(classId, student._id, function(err,resultObj){
                if(err){throw err;}
				console.log("after class.addstudnts" + resultObj._id);
				res.json(JSON.parse("{" + "\"name\":\"" + student.name + "\",\"rollno\":\"" + student.rollno + "\",\"id\":\"" + student._id + "\"}"));    
                }); 
	});
	}
	else if(reciever == "remove"){
		var student = params.student;
		Student.removeStudent(student, function(err, student){
        if(err){throw err;}
        console.log("student created : " + student.string);
		Class.removeStudent(classId, student._id, function(err,resultObj){
                if(err){throw err;}				
				console.log("after class.removestudnts" + resultObj._id);
				res.json(JSON.parse("{" + "\"name\":\"" + student.name + "\",\"rollno\":\"" + student.rollno + "\",\"id\":\"" + student._id + "\"}"));    
                }); 
	});
	}
	else if(reciever == "adminRead"){
		console.log("enteresd admin read");
		var classId = params.classId;
		console.log("getting students by : " + classId);
		Student.getStudentsByClass(classId, function(err, students){
       if(err){
           throw err;
       } 
	   res.json(students);
	});
	}
});

//Get parents
app.get('/api/parents', function(req, res){
    console.log("getting parents");
	Parent.getParents(function(err, parents){
       if(err){
           throw err;
       } 
        res.json(parents);
    });
});

//Performs following functions:
// 1). Add parent and return studentlist. 
// Json: {"function":"add", "params" : {"classid":"5900a6197d29611b78dcf511", "parent":{"name":"Ritik Pathak", "email":"ritikpbhod@gmail.com", "mobile":"9927894488"}}}
// Edited Json: {"function":"add", "parent" :{"password":"pihugolu","aadharId":"fghjklasd","section":"B","city":"Bareilly","email":"ritikpbhod@gmail.com","phone":"9004890850","schoolName":"St. stephens","firstName":"Ritik","class":"IV","middleName":"nope","role":"parent","lastName":"pathak"}}

// return: "{ \"parentid\":\"5901ad2323fb1016949aee93\",\"students\":[{ \"name\":\"Shibu\",\"rollno\":\"121\",\"studentid\":\"59019066e738b307d887e52c\"},{ \"name\":\"Sona\",\"rollno\":\"123\",\"studentid\":\"59019066e738b307d887e52e\"},{ \"name\":\"Rupa\",\"rollno\":\"122\",\"studentid\":\"59019066e738b307d887e52d\"}]}"
// 2). Subscribe to a student
// Json: {"function":"subscribe", "params" : {"parentid":"59e37a4a733594040063f0a5", "studentid":"59e342676057c904003b2e45"}}
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
        var school = params.school;
        var city = params.city;
        var schoolId = params.schoolId;
		var classId = params.classId;
        var parent = params;
        var returnVal = "{ \"parentid\":";
    //console.log("got header id : " + classId);
    Parent.addParents(parent, function(err, parent){
        returnVal += "\"" + parent._id + "\"," + "\"students\":[";
        console.log("class chahiye : " + classId + " : " + section + " : " + city + " : " + school);
        Student.getStudentsByClass(classId, function(err, students){
       if(err){
           throw err;
       } 
         console.log("students found : " + students.length);
		 //if(students.length == 0)
		 students.forEach(function(student) { 
         returnVal += "{ \"name\":\"" + student.name + "\"," + "\"rollno\":\"" + student.rollno + "\"," + "\"studentid\":\""+ student._id + "\"},";
         });
            if(returnVal.substring(returnVal.length-1,returnVal.length) == ",")
			returnVal = returnVal.substring(0, returnVal.length-1);
            returnVal += "]}"
            console.log("return value : " + returnVal);
           res.json(JSON.parse(returnVal));
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
         params= req.body.params;
		var parentid= params.parentid;
        var studentid = params.studentid;
        Parent.unsubscribeStudent(parentid, studentid, function(parent){
            res.json(parent);
        });
    }
});

//Get notifications
app.get('/api/notifications', function(req, res){
    console.log("getting notifications");
	Notification.getNotification(function(err, notifications){
       if(err){
           throw err;
       } 
        res.json(notifications);
    });
});

//Get notifications
app.get('/api/notifmaps', function(req, res){
    console.log("getting notifmaps");
	Notifmap.getNotifMap(function(err, notifmaps){
       if(err){
           throw err;
       } 
        res.json(notifmaps);
    });
});


//Add Notif
//input Class : {"reciever":"class", "params":{"class":"II", "section":"B", "city":"Bareilly", "schoolName":"St. stephens", "studentcount":"6", "notification":{"title":"Sample Notif", "subject":"Hello There!","date":"2017-12-17","classid":"9f4b7cf41618f04000a0a2f"}}}
//input Student: {"reciever":"student", "params":{"class":"II", "section":"B", "city":"Bareilly", "schoolName":"St. stephens", "name":"Shibu","rollno":"121", "notification":{"title":"Sample Notif for student 2","date":"2017-12-17", "subject":"Hello There! 2"}}}
//input Student: {"reciever":"teacher", "params":{"tid":"5a25b37717bf790400ba78d5", "notification":{"title":"Sample Notif for student 2","date":"2017-12-17", "subject":"Hello There! 2"}}}
//load Student ip: {"reciever":"load", "params":{"studentid":"59fe17650d7f850400b3e203"}}
//load Student op: {"notifs":[{"title":"Sample Notif for student","subject":"Hello There!","time":"Sat May 13 2017 13:32:14 GMT+0530 (India Standard Time)"},{"title":"Sample Notif for student 2","subject":"Hello There! 2","time":"Sat May 13 2017 13:32:49 GMT+0530 (India Standard Time)"}]}
//admin read : Get admin read: {"reciever":"adminRead","params":{"classid":"59f4b7cf41618f04000a0a2f","date":"2017-12-17T00:00:00.000Z"}}
//admin Student wise: {"reciever":"load", "params":{"studentid":"59fe17650d7f850400b3e203"}}
//load Teacher ip: {"reciever":"loadT", "params":{"teacherid":"5a25b37717bf790400ba78d5"}}
app.post('/api/notifications', function(req, res){
    console.log("api called notif");
	var reciever = req.body.reciever;
    var params = req.body.params;
    var createdNotif = null;
    
	if(reciever == "class"){
        var className = params.class;
        var section = params.section;
        var schoolName = params.schoolName;
        var city = params.city;
        var notif = params.notification;
        var count = params.studentcount;
        var counter = 1;
        console.log("before adding notuf : " + JSON.stringify(notif));
    Notification.addNotification(notif, function(err, notif){
        if(err){throw err;}
        console.log("notif created : " + notif);
        createdNotif = notif;
		Notification.updateTimeStamp(notif._id, notif.date ,function(err, application){
			if(err) throw err;
			console.log("updated timestamp for : " + application);
			});
		console.log("sending json back");
		res.json(createdNotif);
        Notifmap.addNotifMap(notif._id, function(err, notifmap){
            if(err){throw err;}
            console.log("notifmap created : " + notifmap);
            Student.addNotifToClass(className, section, city, schoolName,notifmap._id, function(err, students){ if(err){throw err;}
            console.log("updated  : " + count + " : " + counter);           
		   if(counter == count)
			{
				console.log("exit here"); 
				}
            counter++;                                                                       
            }); 
        });
    }); 
    }
    else if(reciever == "student"){
        var classId = params.classId;
        var notif = params.notification;
        var name = params.name;
        var rollno = params.rollno;
        Notification.addNotification(notif, function(err, notif){
        console.log("notif created : " + notif);
        createdNotif = notif;
		Notification.updateTimeStamp(notif._id, notif.date ,function(err, application){
			if(err) throw err;
			console.log("updated timestamp for : " + application);
			});
		console.log("sending json back");
		//res.json(createdNotif._id);
             Notifmap.addNotifMap(notif._id, function(err, notifmap){
            if(err){throw err;}
            console.log("notifmap created : " + notifmap);
                 Student.addNotifToStudent(name,rollno,classId,notifmap._id, function(err, student){ if(err){throw err;}
                        console.log("updated  : " + student);
                      res.json(createdNotif._id);                                                                                                       
                });
             });
          });
    }
	else if(reciever == "teacher"){
        var tid = params.tid;
		var notif = params.notification;
        Notification.addNotification(notif, function(err, notif){
        console.log("notif created : " + notif);
        createdNotif = notif;
		Notification.updateTimeStamp(notif._id, notif.date ,function(err, application){
			if(err) throw err;
			console.log("updated timestamp for : " + application);
			});
		console.log("sending json back");
             Notifmap.addNotifMap(notif._id, function(err, notifmap){
            if(err){throw err;}
            console.log("notifmap created : " + notifmap);
                 Teacher.addNotifToTeacher(tid,notifmap.id, function(err, student){ if(err){console.log("err : " + err);}
                        console.log("updated  : " + student);
                      res.json(createdNotif._id);                                                                                                       
                });
             });
          });
    }
    else if(reciever == "load"){
        var studentId = params.studentid;
        var result = "{\"notifs\":[";
        
        Student.getStudentById(studentId, function(err, student){
            if(err){throw err;}
			//var studObj = JSON.parse(student.);
            console.log("student : " + (student[0]).notifications);
            var studentnotifs = student[0].notifications;
            var counter = 0;
            var notifCount = student[0].notifications.length;
            console.log("notif count : " + notifCount);
            studentnotifs.forEach(function(notifmapid){
                Notifmap.getNotifMapById(notifmapid, function(err, notifmap){
            if(err){throw err;}
                      var nm = JSON.stringify(notifmap);
                var status = nm.substr(nm.lastIndexOf(":")+1, 5);
				 console.log("notifmap status : " + nm + " : " + status);
				counter++;
                    if(status === "false"){
                         console.log("notifmap : " + notifmap);
                        Notifmap.updateReadStatus(notifmapid, function(err, notifmapRet){
                           //console.log("notifreturn : " + notifmapRet);
                            if( notifmapRet != null){
                            Notification.getNotificationById(notifmapRet.notification, function(err, notifRet){
							    result += "{\"time\":\"" + notifRet.time + "\",\"subject\":\"" + notifRet.subject +  "\",\"_id\":\"" + notifRet._id +  "\",\"title\":\"" + notifRet.title + "\",\"date\":" + JSON.stringify(notifRet.time).substr(0,11) + "\"},";
                                console.log("result : " + result);
								console.log("result : " + counter + " : " + notifCount);
                               if(counter == notifCount)
                                   {
									   result = result.substr(0, result.length-1);
                                       result += "]}";
									   console.log("final result notif load : " + result);
                                       res.json(JSON.parse(result));
                                   }
                           }); 
                            }
                        });
                    } else if(counter == notifCount) {
					result += "]}";
					res.json(JSON.parse(result));
					}
                });
            });
        }
        );
    }
	else if(reciever == "loadT"){
        var teacherId = params.teacherid;
        var result = "{\"notifs\":[";
        
        Teacher.getTeacherById(teacherId, function(err, student){
            if(err){throw err;}
			//var studObj = JSON.parse(student.);
            console.log("student : " + (student[0]).notifications);
            var studentnotifs = student[0].notifications;
            var counter = 0;
            var notifCount = student[0].notifications.length;
            console.log("notif count : " + notifCount);
            studentnotifs.forEach(function(notifmapid){
                Notifmap.getNotifMapById(notifmapid, function(err, notifmap){
            if(err){throw err;}
                    var nm = JSON.stringify(notifmap);
                var status = nm.substr(nm.lastIndexOf(":")+1, 5);
                  //  var nmid = nm._id;
				     console.log("notifmap 111111 : " + status + " : " + (status == "false") + " : " + (status === "false"));
					 counter++;
                    if(status === "false"){
                        // console.log("notifmap 22222 : " + notifmap);
                        Notifmap.updateReadStatus(notifmapid, function(err, notifmapRet){
                           //console.log("notifreturn : " + notifmapRet);
                            if( notifmapRet != null){
                            Notification.getNotificationById(notifmapRet.notification, function(err, notifRet){
							    result += "{\"time\":\"" + notifRet.time + "\",\"subject\":\"" + notifRet.subject +  "\",\"_id\":\"" + notifRet._id +  "\",\"title\":\"" + notifRet.title + "\"},";
                                console.log("result : " + result);
                               if(counter == notifCount)
                                   {
									   result = result.substr(0, result.length-1);
                                       result += "]}";
									   console.log("final result notif load : " + result);
                                       res.json(JSON.parse(result));
                                   }
                           }); 
                            }
                        });
                    }
                });
            });
        }
        );
    }
else if(reciever == "adminRead"){
		var classId = params.classid;
		var date = params.date;
		Notification.getNotifByClassDate(classId, date, function(err, applications){
			 if(err) throw err;
			 res.json(applications);
		})
	}
	
	});

//1) input : {"reciever":"post", "params":{"classid":"9f4b7cf41618f04000a0a2f", "attendanceArr":[{"studentid":"5916b119aec2b708a0b960e1","date":"2017-12-17","attendance":"Present","classid":"9f4b7cf41618f04000a0a2f"},{"studentid":"5916b119aec2b708a0b960e3","date":"2017-12-17","attendance":"Present","classid":"9f4b7cf41618f04000a0a2f"},{"studentid":"5916b119aec2b708a0b960e2","date":"2017-12-17","attendance":"Absent","classid":"9f4b7cf41618f04000a0a2f"}]}}// 2) input : {"reciever":"get", "params":{"studentid":"5916b119aec2b708a0b960e3", "date":"12/05/2017"} }
// 3) load: {"reciever":"load", "params":{"studentid":"59fe17650d7f850400b3e203"}}
// Get admin read: {"reciever":"adminRead","params":{"classid":"59f4b7cf41618f04000a0a2f","date":"5/11/2017"}}
// {"reciever":"adminEdit", "params":{"id":"","value":""}}
app.post('/api/attendance', function(req, res){
    console.log("adding attendance");
	var reciever = req.body.reciever;
    var params = req.body.params;
    if(reciever == "post"){
        var classId = params.classid;
        var attendanceArr = params.attendanceArr;
        var count = attendanceArr.length;
        var counter = 1;
        attendanceArr.forEach(function(attendanceInst){
			console.log("bug : 1 " + attendanceInst);
            var studentId = attendanceInst.studentid;
			console.log("debug : 1 " + attendanceInst);
            Attendance.addAttendance(attendanceInst, function(err, attendanceRet){
                 if(err){throw err;} 
				console.log("debug : 2");
				var attendanceId = attendanceRet._id;
                /*
				Student.getStudentById(studentId, function(err,classInst){
                     if(err){throw err;} 
					console.log("got stud : " + classInst);
                });
				Class.getClassByID(classId, function(err,classInst){
                     if(err){throw err;} 
					console.log("got class : " + classInst.students);
                });
				*/
				
				Student.addAttendanceById(studentId, attendanceId, function(err,student){
                     if(err){throw err;} 
					//var studentObj =JSON.parse(student);
					console.log("added to stud : " +student);
					if(counter == count){
						res.json(JSON.parse("{\"success\":\"true\"}"));}
                    counter++;
                });
            });
        });
    }
    else if(reciever == "get"){
        var classid = params.classid;
        var date = params.date;
		var resultjson = "{\"attendance\":[";
        Attendance.getAttendanceByDay(classid,date,function(err, attendanceList){
            if(err){throw err;}
			 attendanceList.forEach(function(attendanceId){
			 console.log("attendanceid  : " + attendanceId.studentid + ":" + attendanceId.attendance);
			 resultjson+="{\"studentid\":\"" + attendanceId.studentid + "\",\"value\":\"" + attendanceId.attendance + "\"},";
			 })
			 resultjson = resultjson.substr(0, resultjson.length - 1);
		resultjson +="]}";
		console.log("resturnjson : " + resultjson);	
res.json(JSON.parse(resultjson));		
		});
        }
    else if(reciever == "load"){
        var studentId = params.studentid;
        var result = "{\"attendance\":["
        Attendance.getAttendanceByStudentId(studentId, function(err, attendanceInst){
            if(err){throw err;} 
			console.log("result attList : " + attendanceInst);
			var len = attendanceInst.length;
            var counter = 1;
			attendanceInst.forEach(function(attendance){
                console.log("attendance  : " + attendance);
				if(counter == len){
                        result += "{" + "\"date\":\"" + attendance.date + "\"," + "\"value\":\"" + attendance.attendance + "\"}]}"
                        console.log("result : " + result);
                        res.json(JSON.parse(result));
                    }else
                    {result += "{" + "\"date\":\"" + attendance.date + "\"," + "\"value\":\"" + attendance.attendance + "\"},";}
                    counter++;
		});
    });}
	else if(reciever == "adminRead"){
		var classId = params.classid;
		var date = params.date;
		Attendance.getAttendanceByClassDate(classId, date, function(err, applications){
			 if(err) throw err;
			 res.json(applications);
		});
	}
	else if(reciever == "adminEdit"){
		var Id = params.id;
		var value = params.value;
		Attendance.updateAttendanceValue(Id, value, function(err, attendance){
			 if(err) throw err;
			 res.json(attendance);
		});
	}
});



//resorce ip: /*{"reciever":"upload","params":{"classid":"5910bc227803461e804c08f7","value":"iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAIAAAD6wG44AAAAA3NCSVQICAjb4U/gAAAEEElEQVR4nO2dzW7bRhSF7x1SgpqFl/4TjaxaIKuijmt75SfIomu/h9+raF/CMqB0n6xaiIic7uoWaFzy3i7kFAWacoYxSdEH59t6eEacTyQtje6MzmYzaeTs7Oz09LS5zb9ZLBY3Nzfp7Znfa35IP5I8RSgYHAoGh4LBoWBwKBgcCgaHgsGhYHAoGBwKBoeCwaFgcPL5fN7wZ3cXkbIs0xNVtTmT+UPm69XVVXPr6+vrxWKR3sH5+Xn69Bbz+87Pm1tv3kGqmt5BK5jfdz6fweBQMDgUDA4Fg0PB4FAwOBQMDgWDQ8HgUDA4FAwOBYNDweBEBLedx9jMfqTD/L7ztbl81N0/Y/4yvTyS+X3n8woGz+czGBwKBoeCwaFgcCgYHAoGh4LBoWBwKBgcCgaHgsGhYHAoGJy87fxGM5vZj24zmf+YfL28vGw+pizL1WqV2IG7Hx0dpRc4M7/v/EiFv4isVqtWFeZtT6Ap33PR+/BV8BdZ5iIi7j4p8rzI0vPXe+9u99aJjTf54UiDh93fD5//Nq+Dff7r/xRdjk9CfqQAfLuo3ldB8i8nk1eZycNtZy23a7ltkbIr2XGL01zL7Tv9NZidWH3wx0HW1910IMb9T5aHYNM6mGvkMuoWdasyE88yG/UFkMKoBVuw4Ja5qw890JmJaZDw58D9ds6oBasH18pFB76CXU0kqNQy+Burc0YtmDweCgaHgsGhYHAoGBwKBoeCwaFgcCgYnI4F9zfTiUHf4/OJ+uCLi4vmY7ZdIWnrb96vX6bO93WCq6mHg+Xe7uv9aONtj08kP1IALtvfH9eWuz8t95fpgY9nI9h+qP76sY423vb4RPL5DAaHgsGhYHAoGBwKBoeCwaFgcCgYHAoGh4LBoWBwKBgcCgYnInj4+cunxfjHJ14+Kn1ugJyQb3df3El8WrZ7dnZ2ZvNnKS23Oj6R/MgG0TL4/OV/sOzVZPLdZMhrfTMffLI+Pn5/Em287fGJ5PMZDA4Fg0PB4FAwOBQMDgWDQ8HgjHsNCq3EZvbW7PvKwsPn4KIoDg8P0zPKsmz1RUFRFPP953X2obib1ypPfRmlUQuuZTp1qd5UH94E/bgQ2t75/sss/v3DP1TL+uebXxIbP+R/+3WVWbBpbhZdCG3kjPoWHaSycB9cwsf1qtrWcbTlYa1HlbwOolWd3ffa3QCMWrB6bhpcgoWBB9osSDARnw7bb/eMWrCIbe7M6gO/zqAuriLytO/PMnrB5LFQMDgUDM7464OZz/pg8v9QMDgUDA4Fg0PB4FAwOBQMDgWDQ8HgUDA4FAwOBYNDweBQMDgUDE7HG0TL5nfFvW2AzPy2+R1vEO3ubU+A+b3md3yLHuZ3y8xPz+czGBwKBoeCwaFgcCgYnL8BuYGEJNco/uMAAAAASUVORK5CYII=","title":"Sample Image"}}*/
// updated :  {"reciever":"upload","params":{"classid":"5910bc227803461e804c08f7","value":"iVBOR", "title":"Hell new man", "time":"2017-12-27" }}
// 2). LOad ip : {"reciever":"load","params":{"classid":"5910bc227803461e804c08f7"}}
// o/p : {"resource":[{"date":"Tue May 16 2017 19:34:46 GMT+0530 (India Standard Time)","value":"iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAIAAAD6wG44AAAAA3NCSVQICAjb4U/gAAAEEElEQVR4nO2dzW7bRhSF7x1SgpqFl/4TjaxaIKuijmt75SfIomu/h9+raF/CMqB0n6xaiIic7uoWaFzy3i7kFAWacoYxSdEH59t6eEacTyQtje6MzmYzaeTs7Oz09LS5zb9ZLBY3Nzfp7Znfa35IP5I8RSgYHAoGh4LBoWBwKBgcCgaHgsGhYHAoGBwKBoeCwaFgcPL5fN7wZ3cXkbIs0xNVtTmT+UPm69XVVXPr6+vrxWKR3sH5+Xn69Bbz+87Pm1tv3kGqmt5BK5jfdz6fweBQMDgUDA4Fg0PB4FAwOBQMDgWDQ8HgUDA4FAwOBYNDweBEBLedx9jMfqTD/L7ztbl81N0/Y/4yvTyS+X3n8woGz+czGBwKBoeCwaFgcCgYHAoGh4LBoWBwKBgcCgaHgsGhYHAoGJy87fxGM5vZj24zmf+YfL28vGw+pizL1WqV2IG7Hx0dpRc4M7/v/EiFv4isVqtWFeZtT6Ap33PR+/BV8BdZ5iIi7j4p8rzI0vPXe+9u99aJjTf54UiDh93fD5//Nq+Dff7r/xRdjk9CfqQAfLuo3ldB8i8nk1eZycNtZy23a7ltkbIr2XGL01zL7Tv9NZidWH3wx0HW1910IMb9T5aHYNM6mGvkMuoWdasyE88yG/UFkMKoBVuw4Ja5qw890JmJaZDw58D9ds6oBasH18pFB76CXU0kqNQy+Burc0YtmDweCgaHgsGhYHAoGBwKBoeCwaFgcCgYnI4F9zfTiUHf4/OJ+uCLi4vmY7ZdIWnrb96vX6bO93WCq6mHg+Xe7uv9aONtj08kP1IALtvfH9eWuz8t95fpgY9nI9h+qP76sY423vb4RPL5DAaHgsGhYHAoGBwKBoeCwaFgcCgYHAoGh4LBoWBwKBgcCgYnInj4+cunxfjHJ14+Kn1ugJyQb3df3El8WrZ7dnZ2ZvNnKS23Oj6R/MgG0TL4/OV/sOzVZPLdZMhrfTMffLI+Pn5/Em287fGJ5PMZDA4Fg0PB4FAwOBQMDgWDQ8HgjHsNCq3EZvbW7PvKwsPn4KIoDg8P0zPKsmz1RUFRFPP953X2obib1ypPfRmlUQuuZTp1qd5UH94E/bgQ2t75/sss/v3DP1TL+uebXxIbP+R/+3WVWbBpbhZdCG3kjPoWHaSycB9cwsf1qtrWcbTlYa1HlbwOolWd3ffa3QCMWrB6bhpcgoWBB9osSDARnw7bb/eMWrCIbe7M6gO/zqAuriLytO/PMnrB5LFQMDgUDM7464OZz/pg8v9QMDgUDA4Fg0PB4FAwOBQMDgWDQ8HgUDA4FAwOBYNDweBQMDgUDE7HG0TL5nfFvW2AzPy2+R1vEO3ubU+A+b3md3yLHuZ3y8xPz+czGBwKBoeCwaFgcCgYnL8BuYGEJNco/uMAAAAASUVORK5CYII=","title":"Sample Image"}]}
// Get admin read: {"reciever":"adminRead","params":{"classid":"5910bc227803461e804c08f7","date":"2017-12-27"}}
app.post('/api/resource', function(req, res){
    var reciever = req.body.reciever;
    var params = req.body.params;
    if(reciever == "upload"){
        var classId = params.classid;
        Resource.addResource(params, function(err, resource){
           if(err) throw err;
           // console.log("rsc added : " + resource);
			var resourceId = resource._id;
			Resource.updateTimeStamp(resourceId, resource.time ,function(err, resource){
			if(err) throw err;
			console.log("updated timestamp for : " + resource);
			});
            Class.addResourceToClass(classId, resourceId, function(err, classInst){
                if(err) throw err;
                console.log("updated class : " + classInst);
                var result = "{\"res\":\"" + resourceId + "\"}";
                res.json(JSON.parse(result));
            });
        });
    }
     else if(reciever == "load"){
        var classId = params.classid;
        var result = "{\"resource\":["
        Class.getClassByID(classId, function(err, classInst){
            if(err){throw err;}            
            var resourcelist = classInst.res;
            var len = resourcelist.length;
            counter = 1;
            resourcelist.forEach(function(resId){
                console.log("resid  : " + resId);
                Resource.getResourceByID(resId, function(err, resource){
                    if(err){throw err;}
					if(counter == len && resource != null){
						var data = resource.value;
						var img = new Buffer(data, 'base64');

                        result += "{" + "\"date\":\"" + resource.date + "\"," + "\"id\":\"" + resource._id  + "\"," + "\"title\":\"" + resource.title + "\"," + "\"value\":" + JSON.stringify(resource.value) + "}]}";
                        //console.log("result : " + result);
                        res.json(JSON.parse(result));
                    }else if(counter != len && resource != null)	
                    {
						var data = resource.value;
						var img = new Buffer(data, 'base64');

						//console.log("result : " + result);
				result += "{" + "\"date\":\"" + resource.date + "\"," + "\"title\":\"" + resource.title  +  "\"," + "\"value\":" + JSON.stringify(resource.value) + "},";
				}
                    counter++;
                });
            });
        });
    }
	else if(reciever == "adminRead"){
		var classId = params.classid;
		var date = params.date;         
		Resource.getResourceByClass(classId,date, function(err, resources){
			 if(err) throw err;
			 //console.log("admin read response");
			 res.json(resources);
		})
	}
});

//Get notifications
app.get('/api/attendance', function(req, res){
    console.log("getting attendance");
	Attendance.getAttendance(function(err, attendance){
       if(err){
           throw err;
       } 
        res.json(attendance);
    });
});

//Get notifications
app.get('/api/resource', function(req, res){
    console.log("getting notifications");
	Resource.getResource(function(err, resources){
       if(err){
           throw err;
       } 
        res.json(resources);
    });
});

// Application recieve : {"reciever":"recieve","params":{"classid":"59f4b7cf41618f04000a0a2f","studentid":"59fe17650d7f850400b3e203","date":"2017-12-27", "title":"For Leave of 27 dayz","subject":"My sample leave application yo"}}
// Application recieve : {"reciever":"sync","params":{"classid":"59f4b7cf41618f04000a0a2f"}}
// recieve response : {"applications":[{},{}]}
// Teacher Application response : {"reciever":"teacherResponse","applicationid":"","accepted":"true"}
//Student sync request : {"reciever":"studentsync","params":{"studentid":"59159716307f0e1cf052b990"}}
// Student sync response: {"applications":[{"id":"593e47e70353a3095002f97e","title":"For Leave of 4 dayz","accepted":"false","date":"16-06-2017","studentid":"59159716307f0e1cf052b990"},{"id":"593e5367ab63b30aac025868","title":"For Leave of 3 dayz","accepted":"true","date":"16-06-2017","studentid":"59159716307f0e1cf052b990"}]}
// Get admin read: {"reciever":"adminRead","params":{"classid":"59f4b7cf41618f04000a0a2f","date":"2017-12-16"}}
app.post('/api/applications', function(req, res){
    var reciever = req.body.reciever;
    var params = req.body.params;
    if(reciever == "recieve"){
		console.log("application adding : " + params);
        var classId = params.classid;
        var studentId = params.studentid;
        Application.addApplication(params, function(err, application){
           if(err) throw err;
            console.log("application added : " + application);
			Application.updateTimeStamp(application._id, application.date ,function(err, application){
			if(err) throw err;
			console.log("updated timestamp for : " + application);
			});
            var applicationId = application._id;
            Class.addApplicationToClass(classId, applicationId, function(err, classInst){
                if(err) throw err;
                console.log("updated class : " + classInst);
                Student.addApplicationToStudent(studentId, applicationId, function(err, studentInst){
                if(err) throw err;
                console.log("updated student : " + studentInst);
                var result = "{\"res\":\"" + applicationId + "\"}";
                res.json(JSON.parse(result));
                });
            });
        });
    }
    else if(reciever == "sync"){
        var classId = params.classid;
        var result = "{\"applications\":["
        Application.getApplicationForTeacher(function(err, applis){
       if(err){
           throw err;
       } 
            var appliLen = applis.length;
            var counter = 1;
            console.log("application array : " + applis);
            applis.forEach(function(appli){
                Application.markApplicationTeacherRead(appli._id, function(err, application){
                if(err) throw err;
                     if(counter == appliLen){
                        result += "{" + "\"id\":\""+ application._id +"\",\"title\":\""+ application.title + "\",\"subject\":\"" + application.subject + "\",\"date\":\""+ application.date + "\",\"studentid\":\""+ application.studentid + "\"}]}";
                        console.log("final result : " + result);
                        res.json(JSON.parse(result));
                    }else{
                    result += "{" +"\"id\":\""+ application._id + "\",\"title\":\""+ application.title + "\",\"subject\":\"" + application.subject + "\",\"date\":\""+ application.date +"\",\"studentid\":\""+ application.studentid + "\"},";
                    }
                    counter++;
                });
            });
    });
    }
    else if(reciever == "teacherResponse"){
        var applicationId = req.body.applicationid;
		console.log("application id to search : " + applicationId);
        var accepted = req.body.accepted;
        Application.setApplicationTeacherResponse(applicationId,accepted, function(err, application){
                if(err) throw err;
				console.log("teacherResponse Appli : " + application);
            res.json(application);
        });
    }
    else if(reciever == "studentsync"){
        var studentId = params.studentid;
        var result = "{\"applications\":["
        Application.getApplicationResponseParent(studentId, function(err, applications){
                if(err) throw err;
            var counter = 1;
			console.log("marked application :->> " + applications.length);
            var appliLen = applications.length;
            applications.forEach(function(appli){
                Application.markApplicationResponseParent(appli._id, function(err, application){
                if(err) throw err;
                 console.log("marked application : " + application);
                if(counter == appliLen){
                        result += "{" + "\"id\":\""+ application._id +"\",\"title\":\""+ application.title + "\",\"accepted\":\"" + application.acceptancestatus + "\",\"date\":\""+ application.date + "\",\"subject\":\""+ application.subject  + "\",\"studentid\":\""+ application.studentid + "\"}]}";
                        console.log("final result : " + result);
                        res.json(JSON.parse(result));
                    }else{
                    result += "{" +"\"id\":\""+ application._id + "\",\"title\":\""+ application.title + "\",\"accepted\":\"" + application.acceptancestatus + "\",\"date\":\""+ application.date + "\",\"subject\":\""+ application.subject + "\",\"studentid\":\""+ application.studentid + "\"},";
                    }
                    counter++;
                });
            });
    });
    }
	else if(reciever == "adminRead"){
		var classId = params.classid;
		var date = params.date;
		Application.getApplicationByClassDate(classId, date, function(err, applications){
			 if(err) throw err;
			 res.json(applications);
		})
	}
});

function updateApplicationReadStatus(applicationId){
    Application.getApplicationResponseParent(applicationId, function(err, application){
                if(err) throw err;
    });
}

app.get('/api/applications', function(req, res){
    Application.getApplication(function(err, teachers){
       if(err){
           throw err;
       } 
        res.json(teachers);
    });
});

app.get('/api/periods', function(req, res){
    Period.getPeriods(function(err, periods){
       if(err){
           throw err;
       } 
        res.json(periods);
    });
});


//Add period
// {"reciever":"add", "params" : {"period":{"schoolId":"pihu007","class":"II","section":"B","serialNo":"4","tid":"5a25b37717bf790400ba78d5","tname":"Shiv","dayOfW":"Saturday","subject":"History","subjectCode":"","subjectId":""}}}
// {"reciever":"adminT", "params" :{"tid":"5a25b37717bf790400ba78d5","tname":"Shiv","schoolId":"pihu007","dayOfW":"Saturday"}}
// {"reciever":"adminCD", "params": {"schoolId":"pihu007", "class":"", "section":"", "dayOfW":""}}
// {"reciever":"adminEdit", "params": {"tname":"Fghuh", "newTid":"5a25b2b217bf790400ba78d4", "pid":"5a2d8297620abf04007f3420"}}
app.post('/api/periods', function(req, res){
    var funcVal = req.body.reciever;
	   var params = req.body.params;
	if(funcVal == "add"){
		var periodVal = params.period;
		console.log("period to add : " + periodVal);
		Period.checkTeacherAvail(periodVal.schoolId, periodVal.serialNo, periodVal.dayOfW, periodVal.tid, function(err, periodObj){
       if(err){
           throw err;
       }
	   console.log("periodVal len : " + periodObj.length);
		if(periodObj.length == 0){
			Period.addPeriod(periodVal, function(err, periodObj){
					if(err){
						throw err;
						}        
					console.log("period added : " + periodObj);
					res.json(periodObj);
				});
			}
else {
	res.json(JSON.parse("false"));
}			
        });
	}
	else if(funcVal == "adminT"){
    Period.getPeriodByTeacher(params.schoolId, params.tid, params.tname, params.dayOfW, function(err, periodObj){
       if(err){
           throw err;
       } 
		console.log("period ret : " + periodObj);
		res.json(periodObj);
    });
	}
	else if(funcVal == "adminEdit"){
    Period.updatePeriodByAdmin(params.pid, params.newTid, params.tname, function(err, periodObj){
       if(err){
           throw err;
       } 
		console.log("period ret : " + periodObj);
		res.json(periodObj);
    });
	}
	else if(funcVal == "adminCD")
	{
		Period.getPeriodsByCD(params.schoolId, params.class, params.section, params.dayOfW,function(err, periodObj){
       if(err){
           throw err;
       } 
		console.log("period ret : " + periodObj);
		res.json(periodObj);
    });
	}
});

app.get('/api/subjects', function(req, res){
    Subject.getSubjects(function(err, subjects){
       if(err){
           throw err;
       } 
        res.json(subjects);
    });
});

//Add period
// Add subject : {"reciever":"add", "params" : {"subject":{"name":"Hindi","code":"Hin001","schoolId":"pihu007","className":"I","section":"A"}}}
// {"reciever":"adminRClass", "params" :{"schoolId":"5a5b92495bbc1e0400d49b9f", "class":"", "section":""}}
// {"reciever":"adminRSch", "params" :{"schoolId":"5a5b92495bbc1e0400d49b9f"}}
// Add subvject to class : {"reciever":"adminAddCD", "params": {"classId":"5a5b92495bbc1e0400d49b9f", "subjectId":"5a60f7286257cc0400c863d3"}}
// {"reciever":"adminEdit", "params": {"tname":"Fghuh", "newTid":"5a25b2b217bf790400ba78d4", "pid":"5a2d8297620abf04007f3420"}}
app.post('/api/subjects', function(req, res){
    var funcVal = req.body.reciever;
	var params = req.body.params;
	if(funcVal == "add"){
		var subjectVal = params.subject;
		console.log("period to add : " + subjectVal);
    Subject.addSubject(subjectVal, function(err, subjectObj){
       if(err){
           throw err;
       } 
        
		console.log("period added : " + subjectObj);
		res.json(subjectObj);
    });
	}
	else if(funcVal == "adminRClass"){
    Subject.getSubjectByClass(params.schoolId, params.class, params.section ,function(err, subjectObj){
       if(err){
           throw err;
       } 
		res.json(subjectObj);
    });
	}
	else if(funcVal == "adminRSch"){
    Subject.getSubjectBySchool(params.schoolId, function(err, periodObj){
       if(err){
           throw err;
       } 
		console.log("period ret : " + periodObj);
		res.json(periodObj);
    });
	}
	else if(funcVal == "adminAddCD")
	{
		Class.addSubjectToClass(params.classId, params.subjectId, function(err, classObj){
       if(err){
           throw err;
       } 
		console.log("period ret : " + classObj);
		res.json(classObj);
    });
	}
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
	
Class.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
School.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
Teacher.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
	
Student.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
	
Parent.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
	
Notification.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );

Attendance.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
	
Resource.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );

Application.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
Notifmap.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        }
    );
*/
 