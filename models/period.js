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