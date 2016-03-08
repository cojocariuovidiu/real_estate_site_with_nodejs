var db = require('./../modules/mongo-module');

exports.getServices = function(callback){
	
	db.collection('services').find().toArray(function (err, items) {
        callback({"services": items});
    });
};