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
    classTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

var Teacher = module.exports = mongoose.model('Teacher',TeacherSchema);

//get Teachers
module.exports.getTeachers = function(callback, limit){
    Teacher.find(callback).limit(limit);
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

module.exports.getTeacherBySchool = function(schoolIds,callback){
	console.log("find teacher by : " + schoolIds);
      Teacher.find({},callback);
}	


