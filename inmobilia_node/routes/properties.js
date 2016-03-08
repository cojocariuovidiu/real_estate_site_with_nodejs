var express = require('express');
var busboy = require('connect-busboy');
var multer  = require('multer')
var util = require('util');
var router = express.Router();
var propertiesModule = require('./../modules/properties-module.js');

router.use(busboy());

/*router.all('*',function(req,res,next){
    if(req.session.user == null){
        res.redirect('/');
    }else{
        console.log('PASA!');
        next();
    }
});*/

/*router.get('/', function(req, res) {
    res.render('properties', { title: 'Hello, World!' });
});*/


router.get('/', function(req, res) {
    
    propertiesModule.getProperties(function(items){
		res.json(items);
	});
    
});


router.post('/upload',[ 
    
    multer(
        { dest: './uploads/',
          limits : { fileSize:1000000000 },
          rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase();
          },
          }), function(req, res){
            
            if (!req.files) { // || !req.files.file1) {
                return res.status(403).send('expect 1 file upload named file1').end();
            }
            //console.log(req.files);
            var file = req.files[Object.keys(req.files)[0]];
            console.log(file);
             
            propertiesModule.uploadToS3(file, file.fieldname, function (err, data) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end();
                }
                
                res.status(204).end();
            });
            
}]);

router.post('/', function(req, res) {
    req.checkBody('description', 'description cannot be null or empty').notEmpty();
    req.checkBody('address', 'address cannot be null or empty').notEmpty();
    req.checkBody('propertyType', 'propertyType cannot be null or empty').notEmpty();
    req.checkBody('operationType', 'operationType cannot be null or empty').notEmpty();
    req.checkBody('price', 'price cannot be null or empty').notEmpty();
    req.checkBody('constructionArea', 'constructionArea cannot be null or empty').notEmpty();
    req.checkBody('lotArea', 'lotArea cannot be null or empty').notEmpty();
    //req.checkBody('services', 'services cannot be null or empty').notEmpty().isArray();
    //req.checkBody('nearbyServices', 'nearbyServices cannot be null or empty').notEmpty().isArray();
    req.checkBody('contactInfo', 'contactInfo cannot be null or empty').notEmpty();
    
    
    var errors = req.validationErrors();
    if (errors) {
        res.json(util.inspect(errors), 400);
        return;
    }
    
    
    
    propertiesModule.createProperty(req.body, function(doc){
		res.json(doc, 201);
	});
});

router.put('/', function(req, res) {
    
    req.checkBody('description', 'description cannot be null or empty').notEmpty();
    req.checkBody('address', 'address cannot be null or empty').notEmpty();
    req.checkBody('propertyType', 'propertyType cannot be null or empty').notEmpty();
    req.checkBody('operationType', 'operationType cannot be null or empty').notEmpty();
    req.checkBody('price', 'price cannot be null or empty').notEmpty();
    req.checkBody('constructionArea', 'constructionArea cannot be null or empty').notEmpty();
    req.checkBody('lotArea', 'lotArea cannot be null or empty').notEmpty();
    //req.checkBody('services', 'services cannot be null or empty').notEmpty().isArray();
    //req.checkBody('nearbyServices', 'nearbyServices cannot be null or empty').notEmpty().isArray();
    req.checkBody('contactInfo', 'contactInfo cannot be null or empty').notEmpty();
    
    
    var errors = req.validationErrors();
    if (errors) {
        res.json(util.inspect(errors), 400);
        return;
    }
    
    
    
    propertiesModule.editProperty(req.body, function(doc){
		res.json(doc, 200);
	});
});

router.delete('image', function(req, res){
    propertiesModule.deletePropertyImage(req.params, function(doc){
		res.json(doc, 200);
	});
});

module.exports = router;