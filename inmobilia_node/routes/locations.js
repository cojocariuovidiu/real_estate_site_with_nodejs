var express = require('express');
var util = require('util');
var router = express.Router();
var locationModule = require('./../modules/location-module.js');

router.get('/provinces/', function(req, res) {
    
    locationModule.getProvinces(function(items){
		res.json(items);
	});
				
});

router.get('/cantones/', function(req, res) {
    var provincia = req.query.provincia;
    locationModule.getCantones(provincia, function(items){
		res.json(items);
	});
				
});

router.get('/distritos/', function(req, res) {
    var canton = req.query.canton;
	var provincia = req.query.provincia;
    locationModule.getDistritos(provincia, canton, function(items){
		res.json(items);
	});
				
});
module.exports = router;