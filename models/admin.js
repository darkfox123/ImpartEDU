var mongoose =  require('mongoose');

var AdminSchema = new mongoose.Schema({
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
    role: String
});

var Admin = module.exports = mongoose.model('Admin',AdminSchema);

//get Teachers
module.exports.getAdmin = function(callback, limit){
    Admin.find(callback).limit(limit);
}

// Add Teacher
module.exports.addAdmin = function(admin, callback){
   // console.log("addteacher got schoolid: " + schoolId);
    Admin.create(admin, function (err, awesome_instance) {
  var adminId;
        if (err) return handleError(err);
       adminId = awesome_instance._id;
        callback(awesome_instance._id);
});
}
