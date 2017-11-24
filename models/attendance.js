var mongoose =  require('mongoose');

var AttendanceSchema = new mongoose.Schema({
    studentid: String,
    attendance: String,
    date: String,
	classid:String
});

var Attendance = module.exports = mongoose.model('Attendance', AttendanceSchema);

module.exports.getAttendance = function(callback, limit){
    Attendance.find(callback).limit(limit);
}

module.exports.addAttendance = function(attendance,callback){
  Attendance.create(attendance, callback);
}

module.exports.getAttendanceById = function(attendanceId , callback){
    Attendance.findOne({"_id":attendanceId} , callback);
}

module.exports.getAttendanceByStudentId = function(studentId , callback){
    Attendance.find({"studentid":studentId} , callback);
}

module.exports.getAttendanceByDay = function(classid,date, callback){
 console.log("class srch : " + classid);
    Attendance.find({"classid":classid, "date":date} ,callback);
}

module.exports.getAttendanceByClassDate = function(classId,date,callback){
	console.log("getting att by : " + date + " : " +classId);
    Attendance.find({"classid":classId,"date":date},{_id:1,studentid:1,attendance:1},callback);
}