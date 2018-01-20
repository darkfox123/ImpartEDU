var mongoose =  require('mongoose');

var ResourceSchema = new mongoose.Schema({
    classid: String,
    value: String,
    title:String,
    type:String,
	time: String,
    date: Date
});

var Resource = module.exports = mongoose.model('Resource', ResourceSchema);

module.exports.getResource = function(callback, limit){
    Resource.find(callback).limit(limit);
}

//get res by id
module.exports.getResourceByID = function(resId, callback){
    Resource.findOne({"_id":resId},callback);
}

module.exports.addResource = function(resource,callback){
  Resource.create(resource, callback);
}

module.exports.getResourceByClass = function(classId,date,callback){
    Resource.find({"classid":classId, "date":new Date(date)},{time:1,title:1},callback);
}

module.exports.updateTimeStamp = function(applicationId, time, callback){
	Date timeVal = new Date(time);
	console.log("new date : " + timeVal);
    Resource.findOneAndUpdate({"_id":applicationId},{$set: {"date": timeVal}},{new: true},callback);
}

