var mongoose =  require('mongoose');

var TeacherSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    firstName: String,
    email: String,
    phone: String,
    aadharId: String,
    password: String,
    city: String,
    schoolName: String,
    section: String,
    class: String,
    schoolId:String,
    tId: String,
    role: String,
	periods: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Period'}],
	notifications: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Notifmap'}],
    classTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

var Teacher = module.exports = mongoose.model('Teacher',TeacherSchema);

//get Teachers
module.exports.getTeachers = function(callback, limit){
    Teacher.find(callback).limit(limit);
}

module.exports.addNotifToTeacher = function(tid,notifmapId, callback){
	Teacher.findOneAndUpdate({"_id":tid}, {$push: {notifications: mongoose.Types.ObjectId(notifmapId)}},{new: true}, callback);
}

module.exports.addPeriodToTeacher = function(tid,periodId, callback){
	Teacher.findOneAndUpdate({"_id":tid}, {$push: {periods: mongoose.Types.ObjectId(periodId)}},{new: true}, callback);
}

// Add Teacher
module.exports.addTeachers = function(teacher, callback){
   // console.log("addteacher got schoolid: " + schoolId);
    Teacher.create(teacher, function (err, awesome_instance) {
  var teacherId;
        if (err) return handleError(err);
       teacherId = awesome_instance._id;
        callback(awesome_instance._id);
});
}

//get student by id
module.exports.getTeacherById = function(studentSrch , callback){
 console.log("student srch : " + studentSrch);
    Teacher.find({"_id":studentSrch} , 'notifications',{lean:true}, callback);
}

module.exports.getTeacherBySchool = function(schoolIds,callback){
	console.log("find teacher by : " + schoolIds);
      Teacher.find(callback);
}	


