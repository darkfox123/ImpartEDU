var mongoose =  require('mongoose');

var parentSchema = new mongoose.Schema({
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
	//role:String,
    subscribedStudents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
});

var Parent = module.exports = mongoose.model('Parent',parentSchema);

//get parents
module.exports.getParents = function(callback, limit){
    Parent.find(callback).limit(limit);
}

//add parents
module.exports.addParents = function(parent,callback){
    Parent.create(parent, callback);
}

// Subscribe student
module.exports.subscribeStudent = function(parentId, studentId,callback){
    Parent.findOneAndUpdate({"_id":parentId}, {$push: {subscribedStudents: mongoose.Types.ObjectId(studentId)}},{new: true},
                         (arr,doc) => {
       classId = doc._id;
       console.log("update result doc : " + classId);
       callback(doc);
   });
}

// Unsubscribe student
module.exports.unsubscribeStudent = function(parentId, studentId,callback){
    Parent.findOneAndUpdate({"_id":parentId}, {$pull: {subscribedStudents: mongoose.Types.ObjectId(studentId)}},{new: true},
                         (arr,doc) => {
       classId = doc._id;
       console.log("update result doc : " + classId);
       callback(doc);
   });
}