var mongoose =  require('mongoose');

var citySchema = new mongoose.Schema({
    name: String,
    schools: [{type: mongoose.Schema.Types.ObjectId, ref: 'School'}]
});

var City = module.exports = mongoose.model('City', citySchema);

 //get city
module.exports.getCities = function(callback, limit){
    City.find(callback).limit(limit);
}

//add city
//
//
//
module.exports.addCity = function(city,callback){
    console.log("gonna add : " + city);
    City.create(city, callback);
}

//add school
module.exports.addSchool = (cityName, schoolId ,callback) => {
   console.log("city got : " + cityName + " schid : " + schoolId);
    City.findOneAndUpdate({name:cityName}, {$push: {schools: mongoose.Types.ObjectId(schoolId)}},{new:true}, function(err,doc){
       if(err)
          return console.log(err);
       console.log("updated city : " + doc);
       var id = doc._id;
       callback(id);
   });
    
    /*var query =  getCityByNameQuery(cityName,schoolId);
    query.exec(function(err,city){
       if(err)
          return console.log(err);
         console.log("updated city : " + city);
        callback(city._id);
    });
   */
}

function getCityByNameQuery(name, schoolId, schoolname){
   var query = City.findOneAndUpdate({name:name}, {$push: {schools: mongoose.Types.ObjectId(schoolId)}},{new:true});
   return query;
}