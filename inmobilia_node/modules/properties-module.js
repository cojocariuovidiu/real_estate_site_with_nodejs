var db = require('./../modules/mongo-module');
var aws = require('aws-sdk');
var fs = require('fs');
var accessKey = 'AKIAIRTPEGYZ22YO7YZA';
var secretAccessKey = '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';
var moment = require('moment');
var extend = require('node.extend');
var imagemagick = require('imagemagick');
var path = require('path');
var mongo = require('mongoskin');

//aws.config.loadFromPath('./aws-config.json');

aws.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
}); 

var s3 = new aws.S3();

var imageBucket = new aws.S3({params: {Bucket: 'inmobilia-images'}});

exports.getProperties = function(callback){
	
	db.collection('properties').find().toArray(function (err, items) {
        console.log(items);
        for(i = 0; i < items.length; i++){
            var item = items[i];
            if(item.images != undefined){
                for(j = 0; j < item.images.length; j++){                    
                    getFileUrlFromS3(item.images[j].name, function(url) {
                        item.images[j].url = url;
                    })
                }
            }
        }
        callback( items);
    });
	
};

exports.createProperty = function(body, callback){
	
	 db.collection('properties').insert(extend({'dateCreated' :  moment().format('MMMM Do YYYY, h:mm:ss a') } ,body), function (err, doc) {
        if (err) {           
            throw err;
        }
        else {
            callback(doc);
        }
    });
	
};

exports.editProperty = function(body, callback){
      var id = body._id;
      delete body._id;
      db.collection('properties').update({_id: mongo.helper.toObjectID(id)}, 
       {$set: {
          "name" : body.name,
          "propertyType" : body.propertyType,
          "tags" : body.tags,
          "operationType" : body.operationType,
          "contactInfo" : body.contactInfo,
          "description": body.description,
          "address" : body.address,          
          "currencyPrice" : body.currencyPrice,
          "price" : body.price,
          "bedrooms" : body.bedrooms,
          "bathrooms" : body.bathrooms,
          "parkingSpots" : body.parkingSpots,
          "summary" : body.summary,
          "lotArea" : body.lotArea,
          "constructionArea" : body.constructionArea,
          "services" : body.services,
          "comments" : body.comments,
          "enabled" : true,
          "startDate" : body.startDate,
          "endDate" : body.endDate,
          "dateUpdated" : new Date()
          }
        }, function(err, doc) {   
        if (err) {
            throw err;
        }else{
            console.log('result: ' + doc)
            callback(doc);
        }
    });
};



exports.uploadToS3 = function (file, destFileName, callback) {    
   /* resizeImage(file, function (resizedFile) {
        console.log('The resized file is ');
        console.log(resizedFile);*/
        imageBucket
        .upload({
            ACL: 'public-read', 
            Body: fs.createReadStream(file.path), 
            Key: destFileName.toString(),
            ContentType: 'image/jpg' // force download if it's accessed as a top location
        })
        // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
        // .on('httpUploadProgress', function(evt) { console.log(evt); })
        // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
        .send(callback);
    //});
    
};

exports.deletePropertyImage = function(params, callback){
    db.collection('properties').update({_id: mongo.helper.toObjectID(params.id)},// images: params.name}, 
       {$set: {
          "images" : []
          }
        }, function(err, doc) {   
        if (err) {
            throw err;
        }else{
            console.log('result: ' + doc)
            callback(doc);
        }
    });
}

var resizeImage = function(file, callback){
      console.log('Entro en resize!!!!'); 
      console.log(file);
      imagemagick.resize({
          srcData: fs.readFileSync(file.path, 'binary'),
          width:   256
      }, function(err, stdout, stderr){
          if (err) {
              console.log(err);
              throw err
          }
          fs.writeFileSync(file.path, stdout, 'binary');
          console.log('resized kittens.jpg to fit within 256x256px');
          console.log(file);
          callback(file);
      });
      
};

var getFileUrlFromS3 = function(fileName, callback){
    imageBucket.getSignedUrl('getObject', { Key: fileName }, function(err, url)
    {
        console.log(url);    
        callback(url);
    });
};
