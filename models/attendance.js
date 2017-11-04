var mongoose =  require('mongoose');

var AttendanceSchema = new mongoose.Schema({
    studentId: String,
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