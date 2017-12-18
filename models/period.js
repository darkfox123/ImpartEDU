var mongoose =  require('mongoose');

var periodSchema = new mongoose.Schema({
    schoolId: String,
    class: String,
	classVal:String,
	section: String,
    serialNo: String,
	tid: String,
	tname: String,
	subject: String,
	dayOfW: String
});

var Period = module.exports = mongoose.model('Period', periodSchema);

 //get Periods
module.exports.getPeriods = function(callback, limit){
    Period.update({}, { "classVal": class }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
	Period.find(callback).limit(limit);
}

module.exports.addPeriod = function(period,callback){
  Period.update({}, { subject: "" }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
  Period.create(period, callback);
}

module.exports.getPeriodByTeacher = function(schid, id, name, day, callback){
    console.log("to match : " + schid + " : " + id + " : " + name);
	Period.find({"schoolId":schid, "tid":id, "tname":name, "dayOfW":day} ,callback);
}

module.exports.getPeriodsByCD = function(schid, classname, sectionname, dayOfW, callback){
    console.log("to match : " + schid + " : " + classname + " : " + sectionname);
	Period.find({"schoolId":schid, "class":classname, "section":sectionname, "dayOfW":dayOfW} ,callback);
}

module.exports.updatePeriodByAdmin = function(pId,newTid,tname, callback){
    console.log("to search : " + pId + " : " + newTid + " : " + tname);
	Period.findOneAndUpdate({"_id":pId},{$set: {"tid": newTid, "tname":tname}},{new: true},callback);
}