var mongoose =  require('mongoose');

var StudentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    className:String, 
    section:String,
    city:String,
    schoolName:String,
    classid: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    attendance: [{type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'}],
    notifications: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Notifmap'}],
    applications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Application'}]
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

//get student
module.exports.getStudents = function(callback, limit){
    Student.find(callback).limit(limit);
}

//get students by class id
module.exports.getStudentsByClass = function(className, section, city, schoolName, callback){
 Student.find({"className":className,"section":section,"city":city,"schoolName":schoolName},callback);
}

//get students by class id
module.exports.removeStudent = function(classId, studentid, callback){
 Student.findOneAndRemove({"classid":classId,"_id":studentid}, callback);
}

module.exports.addNotifToClass = function(className, section, city, schoolName, notifmapId, callback){
 var len = 0;
  console.log("searching for : " + className + " : " + section + " : " + schoolName + " : " + city);  
  Student.find({"className":className,"section":section,"city":city,"schoolName":schoolName},function(err,students){
     if(err){throw err;}
      console.log("found students : " + students.length);
      len = students.length;
     students.forEach(function(student){
         //console.log("cool till loop");
         Student.findOneAndUpdate({"_id":student._id}, {$push: {notifications: mongoose.Types.ObjectId(notifmapId)}},{new: true}, callback);
     });
 });
}

module.exports.addNotifToStudent = function(name, rollno, className, section, city, schoolName, notifId, callback){
 Student.findOneAndUpdate({className:className,section:section,city:city,schoolName:schoolName,name:name,rollno:rollno}, {$push: {notifications: mongoose.Types.ObjectId(notifId)}},{new: true}, callback);
}

module.exports.addAttendanceById = function(studentId, attendanceId, callback){
 console.log("studentid : " + studentId + " : " + attendanceId);
  
	Student.findOneAndUpdate({"_id":studentId}, {$push: {attendance: mongoose.Types.ObjectId(attendanceId)}},{new: true}, callback);
}


//get student by id
module.exports.getStudentById = function(studentSrch , callback){
 console.log("student srch : " + studentSrch);
    Student.find({"_id":studentSrch} , 'notifications', callback);
}

/*
//get student by id
module.exports.getStudentNotifsById = function(studentSrch , callback){
 console.log("student srch : " + studentSrch);
    Student.findOne({"_id":studentSrch} , function(err, student){
        if(err){throw err;}
        console.log("student inside : " + student.notifications);
        callback(student);
    });
}
*/


//add student
module.exports.addStudent = function(student,callback){
  console.log("trying to add students");
  Student.create(student, callback);
}


// Add School - when single packet
module.exports.addStudents = (students, callback) => {
    var count = students.length;
    var counter = 1;
    var returnjson = "";
    students.forEach(function(student) {        
    var returnstring = "";
        Student.create(student,function (err, student_instance) {
  if (err) return handleError(err);
        studentId = student_instance._id;
        if(counter==count) {
            returnstring = "\"" + studentId +"\"" + "]}";
            console.log("for counter : " + counter + " and count : " + count + " : returnstring : " + returnstring);
			returnjson += returnstring;
			console.log("added from callback  " + returnjson);
        callback(returnjson);
        }
        else
            {
                returnstring = "\"" + studentId +"\"" + ",";
                console.log("for counter : " + counter + " and count : " + count + " : returnstring : " + returnstring);                
            returnjson += returnstring;
			}
    counter++;
       });
    });
}

 module.exports.addApplicationToStudent = function(studentId, applicationId, callback){
 console.log("studentid : " + studentId + " : " + applicationId);
    Student.findOneAndUpdate({"_id":studentId}, {$push: {applications: mongoose.Types.ObjectId(applicationId)}},{new: true}, callback);
}
