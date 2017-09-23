var mongoose =  require('mongoose');

var NotifmapSchema = new mongoose.Schema({
    readStatus: {type: Boolean, default: false},
    notification: {type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}
});

var Notifmap = module.exports = mongoose.model('Notifmap', NotifmapSchema);

module.exports.getNotifMap = function(callback, limit){
    Notifmap.find(callback).limit(limit);
}

module.exports.addNotifMap = function(notifid,callback){
    console.log("gonna add : " + notifid);
    var nm = JSON.parse("{\"notification\":\"" + notifid + "\"}");
    Notifmap.create(nm, callback);
}

//get notifmap by id
module.exports.getNotifMapById = function(mapSearch , callback){
 console.log("notifmap srch : " + mapSearch);
    Notifmap.find({"_id":mapSearch} , callback);
}

module.exports.updateReadStatus = function(mapid,  callback){
 console.log("map appid : " + mapid);
    Notifmap.findOneAndUpdate({"_id": mapid}, {$set: {"readStatus": true}},{new: true}, callback);
}
