var mongoose =  require('mongoose');

var periodSchema = new mongoose.Schema({
    schoolId: String,
    class: String,
	section: String,
    serialNo: String,
	tid: String,
	tname: String,
	dayOfW: String
});

var Period = module.exports = mongoose.model('Period', periodSchema);

 //get Periods
module.exports.getPeriods = function(callback, limit){
    Period.find(callback).limit(limit);
}

module.exports.addPeriod = function(period,callback){
  Period.create(period, callback);
}

module.exports.getPeriodByTeacher = function(schid, id, name, callback){
    console.log("to match : " + schid + " : " + id + " : " + name);
	Period.find({"schoolId":schid, "tid":id, "tname":name} ,callback);
}

module.exports.updatePeriodByAdmin = function(pId,newTid,tname, callback){
    console.log("to search : " + pId + " : " + newTid + " : " + tname);
	Period.findOneAndUpdate({"_id":pId},{$set: {"tid": newTid, "tname":tname}},{new: true},callback);
}