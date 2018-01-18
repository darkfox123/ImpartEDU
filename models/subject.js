var mongoose =  require('mongoose');

var subjectSchema = new mongoose.Schema({
    schoolId: String,
    name: String,
	code: String,
});

var Subject = module.exports = mongoose.model('Subject', subjectSchema);

 //get Periods
module.exports.getSubjects = function(callback, limit){
	Subject.find(callback).limit(limit);
}

module.exports.addSubject = function(subject,callback){
  Subject.create(subject, callback);
}
