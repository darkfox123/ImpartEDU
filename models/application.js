var mongoose =  require('mongoose');

var ApplicationSchema = new mongoose.Schema({
    title: String,
    subject: String,
    date: String ,
	timeStamp: Date,
    teacherreadstatus: {type:Boolean, default:false},
    teacherresponsestatus: {type:Boolean, default:false},
    parentreadstatus: {type:Boolean, default:false},
    acceptancestatus: {type:Boolean, default:false},
    time: {type: Date, default: Date.now},
    studentid: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    classid: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

var Application = module.exports = mongoose.model('Application', ApplicationSchema);

module.exports.getApplication = function(callback, limit){
	Application.find(callback).limit(limit);
}

module.exports.addApplication = function(application,callback){
  Application.update({}, { timeStamp: "" }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
  Application.create(application, callback);
}

//get app for teacher
module.exports.getApplicationForTeacher = function(callback){
    Application.find({"teacherreadstatus":false},callback);
}

//get app for teacher
module.exports.getApplicationById = function(applicationId,callback){
    Application.find({"_id":applicationId},callback);
}

module.exports.getApplicationByClassDate = function(classId,date,callback){
    Application.find({"classid":classId,"date":date},callback);
}

module.exports.markApplicationTeacherRead = function(applicationId,  callback){
 console.log("appid : " + applicationId);
    Application.findOneAndUpdate({"_id":applicationId}, {$set: {"teacherreadstatus": true}},{new: true}, callback);
}

module.exports.setApplicationTeacherResponse = function(applicationId, accepted, callback){
 console.log("appid : " + applicationId);
    if(accepted == "true"){
    console.log("accepted true :: ->>");
	Application.findOneAndUpdate({"_id":applicationId}, {$set: {"teacherresponsestatus": true, "acceptancestatus": true}},{new: true}, callback);
    } else if(accepted == "false"){
	console.log("accepted false :: ->>");
    Application.findOneAndUpdate({"_id":applicationId}, {$set: {"teacherresponsestatus": true, "acceptancestatus": false}},{new: true}, callback);
    }
}

module.exports.getApplicationResponseParent = function(studentId, callback){
    Application.find({"studentid":studentId, "teacherreadstatus": true,"teacherresponsestatus": true, "parentreadstatus":false },callback);
}

module.exports.markApplicationResponseParent = function(applicationId, callback){
    Application.findOneAndUpdate({"_id":applicationId},{$set: {"parentreadstatus": true}},{new: true},callback);
}

//{$set: {"parentreadstatus": true}},{new: true, multi: true},

