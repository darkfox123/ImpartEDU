var mongoose =  require('mongoose');

var NotificationSchema = new mongoose.Schema({
    title: String,
    subject: String,
    time: Date,
	date: String ,
	classid:String,
	studentid:String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}
});

var Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.getNotification = function(callback, limit){
    Notification.find(callback).limit(limit);
}

module.exports.addNotification = function(notif,callback){
  console.log("notification to add  : " + notif.toString);
    Notification.update({}, { studentid: "" }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
	Notification.create(notif, callback);
}

module.exports.getNotificationById = function(notif , callback){
    Notification.findOne({"_id":notif} , callback);
}

module.exports.getNotifByClassDate = function(classId,date,callback){
    Notification.find({"classid":classId,"time":new Date(date)},callback);
}

module.exports.updateTimeStamp = function(applicationId, date, callback){
    Notification.findOneAndUpdate({"_id":applicationId},{$set: {"time": new Date(date)}},{new: true},callback);
}