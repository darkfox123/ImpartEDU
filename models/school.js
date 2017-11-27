var mongoose =  require('mongoose');

var schoolSchema = new mongoose.Schema({
    name: String,
    schoolId: String,
    city: String,
	admin: String,
    classes : [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
    teachers : [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}]
});

var School = module.exports = mongoose.model('School', schoolSchema);

 //get Schools
module.exports.getSchools = function(callback, limit){
    School.find(callback).limit(limit);
}

module.exports.getSchoolNameById = function(school , callback){
    School.findOne({"_id":school}, function (err, awesome_instance) {
  if (err) return handleError(err);
        school = awesome_instance;
  //console.log("added from callback  " + school);
        callback(school);
});
}

module.exports.getSchoolByNameCity = function(schoolName, cityName , callback){
    School.findOne({"name":schoolName, "city":cityName}, function (err, awesome_instance) {
  if (err) return handleError(err);
        school = awesome_instance;
  console.log("added from callback  " + school);
        callback(school);
});
}



// Add School
module.exports.addSchools = (school, schoolId, callback) => {
    School.create(school, function (err, awesome_instance) {
  if (err) return handleError(err);
        school = awesome_instance;
  console.log("added from callback  " + school);
        callback(school);
});
}

// Add class
module.exports.addAdminToSchool = function(schoolId ,adminId, callback){ 
     console.log("calling school add");
	 School.find({schoolId:schoolId}, function (err, doc) {
    if (err) return done(err);
    // Create the new field if it doesn't exist yet
    doc.admin || (doc.admin = [])
    doc.admin.push('value');
console.log("saving done");
    doc.save();
});

}

// Add class
module.exports.addClass = function(schoolId ,classId, callback){ 
     School.findOneAndUpdate({schoolId:schoolId}, {$push: {classes: mongoose.Types.ObjectId(classId)}},{new: true}, function (err, awesome_instance) {
  if (err) return handleError(err);
        school = awesome_instance;
  // console.log("updated scchool : " + school);
        callback(school);
});
}

function getSchoolByIdQuery(schoolId, classId){
   var query = School.findOneAndUpdate({schoolId:schoolId}, {$push: {classes: mongoose.Types.ObjectId(classId)}},{new: true});
   return query;
}