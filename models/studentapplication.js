var mongoose =  require('mongoose');

var StudentapplicationSchema = new mongoose.Schema({
    title: String,
    subject: String,
    date: String ,
    studentid: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    classid: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
});

var Studentapplication = module.exports = mongoose.model('Studentapplication', StudentapplicationSchema);

module.exports.getStudentapplication = function(callback, limit){
    Studentapplication.find(callback).limit(limit);
}

module.exports.addStudentapplication = function(studentapplication,callback){
  Studentapplication.create(studentapplication, callback);
}