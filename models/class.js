var mongoose =  require('mongoose');

var classSchema = new mongoose.Schema({
    name: String,
    section: String,
    students:[{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    res:[{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
    application:[{type: mongoose.Schema.Types.ObjectId, ref: 'Studentapplication'}],
    classTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    schoolName: String,
    schoolId:String,
    city: String
});

var Class = module.exports = mongoose.model('Class', classSchema);

//get city
module.exports.getClasses = function(callback, limit){
    Class.find(callback).limit(limit);
}

//get classes by school
module.exports.getClasseBySchool = function(schoolName, city, callback){
    Class.find({schoolName:schoolName,city:city},callback);
}

//get classes by school
module.exports.getClassByID = function(classId, callback){
    Class.findOne({"_id":classId},callback);
}

//add city
module.exports.addClasses = function(classes,callback){
    classes.forEach(function(classinst) {
        console.log("adding a class : " + classinst);
  Class.create(classinst, callback);
});
}

module.exports.addClass = function(classInst, schoolId, callback){
    //console.log( id " + schoolId);
    Class.create(classInst, function (err, awesome_instance,  schoolId) {
  if (err) return handleError(err);
        classId = awesome_instance._id;
  console.log("added from callback  " + awesome_instance);
        callback(classId, schoolId);
});
}

// Add classteacher
module.exports.addClassTeacher = ( teacherId, schoolId ,classname, section, classId, callback) => {
  console.log("got tidin scnd fn : " + teacherId); Class.findOneAndUpdate({schoolId:schoolId,name:classname,section:section}, {$push: {classTeacher: mongoose.Types.ObjectId(teacherId)}},{new: true},
                         (arr,doc) => {
       classId = doc._id;
       console.log("update result doc : " + classId);
       callback(classId);
   });
}

module.exports.addResourceToClass = function(classId, resourceId, callback){
 console.log("resourceid : " + classId + " : " + resourceId);
    Class.findOneAndUpdate({"_id":classId}, {$push: {res: mongoose.Types.ObjectId(resourceId)}},{new: true}, callback);
}

module.exports.addApplicationToClass = function(classId, applicationId, callback){
 console.log("appplicationid : " + classId + " : " + applicationId);
    Class.findOneAndUpdate({"_id":classId}, {$push: {application: mongoose.Types.ObjectId(applicationId)}},{new: true}, callback);
}

module.exports.addStudents = ( classId, studentids, callback) => {
  console.log("got classid scnd fn : " + classId); 
  studentids.forEach(function(student) {       
    var query = {"_id": classId};  Class.findOneAndUpdate(query, {$push: {students: mongoose.Types.ObjectId(student)}},{new: true},(arr,doc) => {
       console.log("update result doc : " + doc);
    });
   });
}

function getClass(teacherid, schoolId, classname, section){
   var query = Class.findOneAndUpdate({schoolId:schoolId,name:classname,section:section}, {$push: {classTeacher: mongoose.Types.ObjectId(teacherid)}},{new: true});
   return query;
}