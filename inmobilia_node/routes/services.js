var express = require('express');
var util = require('util');
var router = express.Router();
var servicesModule = require('./../modules/services-module.js');

router.get('/', function(req, res) {
    res.render('services', { title: 'Hello, World!' });
});


router.get('/list', function(req, res) {
    
    servicesModule.getServices(function(items){
		res.json(items);
	});
    
});

module.exports = router;