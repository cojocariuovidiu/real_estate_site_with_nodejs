var db = require('./../modules/mongo-module');

exports.getProvinces = function(callback){
	
	db.collection('provincias').find().toArray(function (err, items) {
		console.log(items);
        callback({"provinces": items});
    });
};

exports.getCantones = function(nombreProvincia, callback){
	
	getProvinceByName(nombreProvincia, function(hash){
		
		db.collection('cantones').find({provinciaId: hash.provinciaId}).toArray(function (err, items) {
	        callback({"cantones": items});					
		});
	});
};

exports.getDistritos = function(nombreProvincia, nombreCanton, callback){
	
	getProvinceByName(nombreProvincia, function(provincia){
		getCantonByName(nombreCanton, function(canton){
			db.collection('distritos').find({provinciaId: provincia.provinciaId, cantonId: canton.cantonId}).toArray(function (err, items) {
		        callback({"distritos": items});
		    });
		});
	});
};

var getProvinceByName = function(nombreProvincia, callback){
	db.collection('provincias').findOne({name: nombreProvincia}, function(err, result) {
	    if (err) throw err;
		
	    callback(result);		
	});
};	

var getCantonByName = function(nombreCanton, callback){
	db.collection('cantones').findOne({name: nombreCanton}, function(err, result) {
	    if (err) throw err;
		
	    callback(result);		
	});
};