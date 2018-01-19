var mongoose =  require('mongoose');

var subjectSchema = new mongoose.Schema({
    schoolId: String,
    name: String,
	code: String,
	className:String,
	section:String
});

var Subject = module.exports = mongoose.model('Subject', subjectSchema);

 //get Periods
module.exports.getSubjects = function(callback, limit){
	Subject.find(callback).limit(limit);
}

module.exports.addSubject = function(subject,callback){
  Subject.create(subject, callback);
}

//get classes by school
module.exports.getSubjectBySchool = function(schoolId, callback){
	Subject.find({"schoolId":schoolId},callback);
}

module.exports.getSubjectByClass = function(schoolId,className, section, callback){
	Subject.find({"schoolId":schoolId, "className":className, "section":section},callback);
}
