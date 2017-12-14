var mongoose =  require('mongoose');

var NotificationSchema = new mongoose.Schema({
    title: String,
    subject: String,
    time: {type: Date, default: Date.now},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}
});

var Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.getNotification = function(callback, limit){
    Notification.find(callback).limit(limit);
}

module.exports.addNotification = function(notif,callback){
  console.log("notification to add  : " + notif.toString);
    Notification.create(notif, callback);
}

module.exports.getNotificationById = function(notif , callback){
    Notification.findOne({"_id":notif} , callback);
}

module.exports.getNotifByClassDate = function(classId,date,callback){
    Notification.find({"classid":classId,"date":date},callback);
}
