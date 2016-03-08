var dataService = new dataService();
var callbackHelper = new callbackHelper();
var newImageDropZone;
var editImageDropZone;
var markers = [];
var newMap;
var editMap;
var geocoder;

function propertiesViewModel(){
	
	var self = this;
	
	/*
		GLOBAL VARIABLES	
	*/
	self.properties = ko.observableArray([]);
	self.provincias = ko.observableArray([]);
	self.cantones = ko.observableArray([]);
	self.distritos = ko.observableArray([]);

	self.selectedProvincia = ko.observable({ required: true });
	self.selectedCanton = ko.observable({ required: true });
	self.selectedDistrito = ko.observable({ required: true });	
	
	self.propertyTypes = ko.observableArray(['House', 'Apartment', 'Building', 'Duplex', 'Clubs', 'Haciendas', 'Fincas', 'Commercial', 'Industrials', 'Offices', 'Lands', 'Room']);
	self.tags = ko.observableArray(['Nuevo', 'Destacado', 'Negociable']);
	self.currencies = ko.observableArray(['$', '₡']);
	self.operationTypes = ko.observableArray(['Sell', 'Rent']);
	self.services = ko.observableArray([]);
	
	/*
		New Property
	*/	
	self.newName = ko.observable().extend({ required: true });
	self.newPropertyType = ko.observable().extend({ required: true });
	self.newOperationType = ko.observable().extend({ required: true });
	self.newTags = ko.observableArray([]);
	self.newContact = ko.observable().extend({ required: true });
	self.newContactPhoneNumber = ko.observable().extend({ required: true });
	self.newDescription = ko.observable().extend({ required: true });
	self.newLocation = ko.observable().extend({ required: true });
	self.newPrice = ko.observable().extend({ required: true, min : 0 });
	self.newCurrencyPrice = ko.observable().extend({ required: true});
	self.newBedrooms = ko.observable().extend({
		required : {
			onlyIf : function() {
				return (self.newPropertyType() != 'Building' || self.newPropertyType() != 'Room');
			}
		},
		min : 0
	});
	self.newBathrooms = ko.observable().extend({ required: true, min : 0 });
	self.newParkingSpots = ko.observable();
	self.newLotArea = ko.observable().extend({ required: true });
	self.newConstructionArea = ko.observable().extend({ required: true });	
	self.newServices = ko.observableArray([]);
	self.newNearByServices = ko.observable();	
	self.newComment =ko.observable();
	self.newEnabled = ko.observable();//.extend({ required: true });
	self.newExpirationDate = ko.observable();//.extend({ required: true });
	self.newCoordinates = ko.observable();
	self.newStartDate = ko.observable();
	self.newEndDate = ko.observable();
	
	/*
		Edit Property
	*/
	
	self.editName = ko.observable().extend({ required: true });
	self.editPropertyId = ko.observable();
	self.editTags = ko.observableArray([]);
	self.editPropertyType = ko.observable();
	self.editOperationType = ko.observable();
	self.editName = ko.observable();
	self.editContact = ko.observable().extend({ required: true });
	self.editContactPhoneNumber = ko.observable().extend({ required: true });
	self.editDescription = ko.observable().extend({ required: true });
	self.editLocation = ko.observable();
	self.editPrice = ko.observable();
	self.editCurrencyPrice = ko.observable().extend({ required: true});
	self.editBedrooms = ko.observable().extend({
		required : {
			onlyIf : function() {
				return (self.editPropertyType() != 'Building' || self.editPropertyType() != 'Room');
			}
		},
		min : 0
	});
	self.editBathrooms = ko.observable().extend({ required: true, min : 0 });
	self.editParkingSpots = ko.observable();
	self.editLotArea = ko.observable();
	self.editConstructionArea = ko.observable();	
	self.editServices =ko.observable();;
	self.editNearByServices =ko.observable();
	self.editEnabled = ko.observable();
	self.editExpirationDate = ko.observable();	
	self.editCoordinates = ko.observable();
	self.editComment = ko.observable();
	self.editStartDate = ko.observable();
	self.editEndDate = ko.observable();
	
	/*
		VIEW MODEL METHODS
	*/

	self.prepareNewProperty= function(){
        $('#newProperty').on('shown.bs.modal', function () {
              google.maps.event.trigger(newMap, 'resize');
              newMap.setCenter(new google.maps.LatLng(9.927595, -84.082489));
            });
		$('#newProperty').modal('show');
	};
	
	self.startEditingProperty = function(property){
		self.editPropertyId(property._id);
		self.editName(property.name);
		self.editPropertyType(property.propertyType);
		self.editOperationType(property.operationType);		
		self.editContact(property.contactInfo.name);
		self.editContactPhoneNumber(property.contactInfo.contactPhoneNumber);
		self.editDescription(property.description);
		self.editLocation(property.address.location);
		self.selectedProvincia(property.address.provincia);
		self.selectedCanton(property.address.canton);
		self.selectedDistrito(property.address.distrito);
		self.editPrice(property.price.substring(1));
		self.editCurrencyPrice(property.price.substring(0, 1));
		self.editBedrooms(property.bedrooms);
		self.editBathrooms(property.bathrooms);
		self.editParkingSpots(property.parkingSpots);
		self.editLotArea(property.lotArea);
		self.editConstructionArea(property.constructionArea);	
		self.editTags(property.tags);
		self.editServices(property.services);
		self.editEnabled(property.enabled);
		self.editCoordinates(property.address.coordinates);
		self.editComment(property.comments);
		self.editStartDate(property.startDate);
		self.editEndDate(property.endDate);
		
		$('#editProperty').on('shown.bs.modal', function () {
              google.maps.event.trigger(editMap, 'resize');
			  if(property.address.coordinates !== undefined){
				  var editCoordinates = [property.address.coordinates.substring(0, property.address.coordinates.lastIndexOf(','))  ,
				  property.address.coordinates.substring(property.address.coordinates.lastIndexOf(',') +1)];
	              editMap.setCenter(new google.maps.LatLng(editCoordinates[0], editCoordinates[1]));
				  
				  var markr = new google.maps.Marker({
					    position: new google.maps.LatLng(editCoordinates[0], editCoordinates[1]),
					    map: editMap,
						animation : google.maps.Animation.DROP,
						draggable: true
					});
				markers.push(markr);
			  }
			  
			
            });

		for (i = 0; i < property.images.length; i++) { 
			var image = property.images[i];
			var mockFile = { name: image.name, size: 2000, status: Dropzone.ADDED };
		    // Call the default addedfile event handler
			editImageDropZone.emit("addedfile", mockFile);

			// And optionally show the thumbnail of the file:
			editImageDropZone.emit("thumbnail", mockFile, image.url);

			// Make sure that there is no progress bar, etc...
			editImageDropZone.emit("complete", mockFile);
			editImageDropZone.files.push(mockFile);
		}	

		$('#editProperty').modal('show');
	};
	
	self.editProperty = function(){
		if (!callbackHelper.areFieldsValid(vgEditProperty)) {
			return;
		}		

		var images = [];
		
		for (i = 0; i < editImageDropZone.files.length; i++) { 
			var file = editImageDropZone.files[i];
		    var name = file.size + '_' + file.name;
			images.push(name);
		}	
		
		editImageDropZone.processQueue();

		var summary = '';
		summary = summary.concat(self.editBedrooms() !== 'undefined' ? self.editBedrooms() + ' bds • ' : '',
						self.editBathrooms() !== 'undefined' ? self.editBathrooms() + ' ba • ' : '',
						self.editConstructionArea() !== 'undefined' ? self.editConstructionArea() + ' mt2 • ' : '',
						self.editLotArea() !== 'undefined' ? self.editLotArea() + ' mt2 lot ' : '');
		var editProperty = {
			"_id" : self.editPropertyId(),
			"name" : self.editName(),
			"propertyType" : self.editPropertyType(),
			"operationType" : self.editOperationType(),
			"tags" : self.editTags(),
			"contactInfo" : {
				"name" : self.editContact(), "contactPhoneNumber": self.editContactPhoneNumber()
			},					
			"description": self.editDescription(),
			"address" : { 
				"location" : self.editLocation(),
				"distrito" : self.selectedDistrito(),
				"canton" : self.selectedCanton(),
				"provincia" : self.selectedProvincia(),
				"coordinates" : self.editCoordinates()
			},
			"currencyPrice" : self.editCurrencyPrice(),
			"price" : self.editCurrencyPrice() + ''+ self.editPrice(),
			"bedrooms" : self.editBedrooms(),
			"bathrooms" : self.editBathrooms(),
			"parkingSpots" : self.editParkingSpots(),
			"summary" : summary,
			"lotArea" : self.editLotArea(),
			"constructionArea" : self.editConstructionArea(),
			"services" : self.editServices(),
			"comments" : self.editComment(),
			"enabled" : true,
			"startDate" : self.editStartDate(),
			"endDate" : self.editEndDate(),
			"images" : images
		};
		
		dataService.editProperty(JSON.stringify(editProperty),
				self.editPropertySuccessCallback,
				self.editPropertyErrorCallback);
						
	};
	
	self.insertNewProperty = function(){
		if (!callbackHelper.areFieldsValid(vgNewProperty)) {
			return;
		}		
		
		var images = [];
		
		for (i = 0; i < newImageDropZone.files.length; i++) { 
			var file = newImageDropZone.files[i];
		    var name = file.size + '_' + file.name;
			var image = {'name' : name};
			images.push(image);
		}	
		
		newImageDropZone.processQueue();
		//4 bds • 3 ba • 1,700 sqft • 8,000 sqft lot
		var summary = '';
		summary = summary.concat(self.newBedrooms() !== 'undefined' ? self.newBedrooms() + ' bds • ' : '',
						self.newBathrooms() !== 'undefined' ? self.newBathrooms() + ' ba • ' : '',
						self.newConstructionArea() !== 'undefined' ? self.newConstructionArea() + ' mt2 • ' : '',
						self.newLotArea() !== 'undefined' ? self.newLotArea() + ' mt2 lot ' : '');
		
		var newProperty = {
			"name" : self.newName(),
			"propertyType" : self.newPropertyType(),
			"operationType" : self.newOperationType(),
			"tags" : self.newTags(),
			"contactInfo" : {
				"name" : self.newContact(), "contactPhoneNumber": self.newContactPhoneNumber()
			},					
			"description": self.newDescription(),
			"address" : { 
				"location" : self.newLocation(),
				"distrito" : self.selectedDistrito(),
				"canton" : self.selectedCanton(),
				"provincia" : self.selectedProvincia(),
				"coordinates" : self.newCoordinates()
			},
			"currencyPrice" : self.newCurrencyPrice(),
			"price" : self.newCurrencyPrice() + ''+ self.newPrice(),
			"bedrooms" : self.newBedrooms(),
			"bathrooms" : self.newBathrooms(),
			"parkingSpots" : self.newParkingSpots(),
			"summary" : summary,
			"lotArea" : self.newLotArea(),
			"constructionArea" : self.newConstructionArea(),
			"services" : self.newServices(),
			"comments" : self.newComment(),
			"enabled" : true,
			"startDate" : self.newStartDate(),
			"endDate" : self.newEndDate(),
			"images" : images
		};
		
		dataService.insertProperty(JSON.stringify(newProperty),
				self.insertNewPropertySuccessCallback,
				self.insertNewPropertyErrorCallback);
	};
	
	/*
		CLEANING METHODS
	*/
	
	self.cleanNewProperty = function(){		
		self.newName('');
		self.newPropertyType('');
		self.newOperationType('');
		self.newTags([]);
		self.newContact('');
		self.newContactPhoneNumber('');
		self.newDescription('');
		self.newLocation('');
		self.newCurrencyPrice(),
		self.newPrice('');
		self.newBedrooms('');
		self.newBathrooms('');
		self.newParkingSpots('');
		self.newLotArea('');
		self.newConstructionArea('');
		self.newServices([]);
		self.newNearByServices('');	
		self.newComment('');
		self.newEnabled('');
		self.newExpirationDate('');
		self.newCoordinates('');
		self.newStartDate('');
		self.newEndDate('');
		callbackHelper.resetFieldsModified(self);	
	};
	
	self.cleanEditProperty = function(){		
		self.editName('');
		self.editPropertyType('');
		self.editOperationType('');
		self.editTags([]);
		self.editContact('');
		self.editContactPhoneNumber('');
		self.editDescription('');
		self.editLocation('');
		self.editCurrencyPrice(),
		self.editPrice('');
		self.editBedrooms('');
		self.editBathrooms('');
		self.editParkingSpots('');
		self.editLotArea('');
		self.editConstructionArea('');
		self.editServices([]);
		self.editNearByServices('');	
		self.editComment('');
		self.editEnabled('');
		self.editExpirationDate('');
		self.editCoordinates('');
		self.editStartDate('');
		self.editEndDate('');
		callbackHelper.resetFieldsModified(self);	

	};
	/*
		VALIDATION GROUPS
	*/
	
	var vgNewProperty = [self.selectedProvincia, self.selectedCanton, self.selectedDistrito, self.newConstructionArea,  self.newBedrooms, self.newBathrooms, self.newLotArea, self.newCurrencyPrice, self.newPrice, self.newLocation, self.newName, self.newPropertyType, self.newOperationType, self.newDescription ];
	var vgEditProperty = [self.editConstructionArea,  self.editLotArea, self.editPrice, self.editLocation, self.editPropertyType, self.editOperationType, self.editDescription, self.editName];
	
	/*
		LOADING METHODS
	*/
	self.loadProperties = function() {
		self.properties([]);
		dataService.getProperties(self.getPropertiesSuccessCallback,
				self.getPropertiesErrorCallback);
	};
	
	self.loadServices = function() {
		self.services([]);
		dataService.getServices(self.getServicesSuccessCallback,
				self.getServicesErrorCallback);
	};
	
	self.getProvincias = function(){
		self.provincias([]);
		dataService.getProvinces(self.getProvinciasSuccessCallback,
				self.getProvinciasErrorCallback);
	};
	
	self.getCantones = function(){
		self.cantones([]);
		dataService.getCantones(self.selectedProvincia(), self.getCantonesSuccessCallback,
				self.getCantonesErrorCallback);
	};
	
	self.getDistritos = function(){
		self.distritos([]);
		dataService.getDistritos(self.selectedProvincia(), self.selectedCanton(), self.getDistritosSuccessCallback,
				self.getCantonesErrorCallback);
	};
		
	/*
		CALLBACKS
	*/
	
	self.insertNewPropertySuccessCallback = function(response) {
		//self.loadProperties();
		
		$('#newProperty').modal('hide');
		callbackHelper.showSuccessMessage('New Property was created correctly');
		self.cleanNewProperty();
		self.loadProperties();
	};
	
	self.insertNewPropertyErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		callbackHelper.showPermanentError('There was a problem adding the new property');
	};
	
	self.editPropertySuccessCallback = function(response) {
		//self.loadProperties();
		
		$('#editProperty').modal('hide');
		callbackHelper.showSuccessMessage('Property ' + self.editName() + ' was updated correctly');
		self.cleanEditProperty();
		self.loadProperties();
		
	};
	
	self.editPropertyErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		callbackHelper.showPermanentError('There was a problem editing the property');
	};
	
	self.getServicesSuccessCallback = function(response) {
		self.services(response.services);
	};
	
	self.getServicesErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		//callbackHelper.showPermanentError('There was a problem loading the orders, please reload the page');
	};
	
	self.getPropertiesSuccessCallback = function(response) {
		self.properties(response.properties);
	};
	
	self.getPropertiesErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		//callbackHelper.showPermanentError('There was a problem loading the orders, please reload the page');
	};
	
	self.getProvinciasSuccessCallback = function(response) {
		self.provincias(response.provinces);
	};
	
	self.getProvinciasErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		//callbackHelper.showPermanentError('There was a problem loading the orders, please reload the page');
	};
	
	self.getCantonesSuccessCallback = function(response) {
		self.cantones(response.cantones);
	};
	
	self.getCantonessErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		//callbackHelper.showPermanentError('There was a problem loading the orders, please reload the page');
	};
	
	self.getDistritosSuccessCallback = function(response) {
		self.distritos(response.distritos);
	};
	
	self.getDistritosErrorCallback = function(response, textStatus, errorThrown) {
		// set error message to display the error
		//self.noErrors(false);
		//callbackHelper.showPermanentError('There was a problem loading the orders, please reload the page');
	};
	
	/*fge
		SUBSCRIBER
	*/
	
	this.selectedProvincia.subscribe(function (newText) {
		if(newText !== undefined){
			
			geocoder.geocode({ 'address': newText + ', Costa Rica' }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            newMap.setCenter(results[0].geometry.location);
                        }
            });
			self.getCantones();
		}
		
	});
	
	this.selectedCanton.subscribe(function (newText) {
		if(newText !== undefined){
			geocoder.geocode({ 'address': newText + ' ' + self.selectedProvincia() + ', Costa Rica' }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            newMap.setCenter(results[0].geometry.location);
							newMap.setZoom(15);
                        }
            });
			self.getDistritos();	
		}
		
	});
	
	/*
		CUSTOM BINDINGS
	*/
	
	 ko.bindingHandlers.newDropzone = {
        init: function(element, valueAccessor)
        {
           var value = ko.unwrap(valueAccessor());
 
            var options = {
                maxFileSize: 2,
                createImageThumbnails: true,
				dictDefaultMessage: 'Drop or Click to add Images!',
				uploadMultiple : false,
				acceptedFiles: 'image/*',
				dictFileTooBig: 'File size must not exceed 2MB',
				autoProcessQueue : false,
				addRemoveLinks: true,
				parallelUploads: 10
            };
 
            $.extend(options, value);
 
            $(element).addClass('dropzone');
           newImageDropZone=  new Dropzone(element, options); 
		   newImageDropZone.on("sending", function(file, xhr, formData) {
		      var name = file.size + '_' + file.name;
		      formData.append(name, file);
		   });
        }
    };

    ko.bindingHandlers.editDropzone = {
        init: function(element, valueAccessor)
        {
           var value = ko.unwrap(valueAccessor());
 
            var options = {
                maxFileSize: 2,
                createImageThumbnails: true,
				dictDefaultMessage: 'Drop or Click to add Images!',
				uploadMultiple : false,
				acceptedFiles: 'image/*',
				dictFileTooBig: 'File size must not exceed 2MB',
				autoProcessQueue : false,
				addRemoveLinks: true,
				parallelUploads: 10,
				thumbnailWidth:"250",
  				thumbnailHeight:"250"
            };
 
            $.extend(options, value);
 
            $(element).addClass('dropzone');
           editImageDropZone=  new Dropzone(element, options); 
		   editImageDropZone.on("sending", function(file, xhr, formData) {
		      var name = file.size + '_' + file.name;
		      formData.append(name, file);
		   });
		   
		   editImageDropZone.on("removedfile", function(file, xhr, formData) {
		      /*var name = file.size + '_' + file.name;
		      formData.append(name, file);*/
		   });
        }
    };

    self.locations= ko.observableArray([
        {name: "Cleveland", latitude:41.48 , longitude:-81.67},
        {name: "Parma", latitude: 41.40, longitude: -81.73}
    ]);
	
	ko.bindingHandlers.newPropertyGoogleMap = {
	    init: function (element, valueAccessor) {
	         var
	          value = valueAccessor(),			  
	          mapOptions = {
	            zoom: 10,
	            center: new google.maps.LatLng(9.927595, -84.082489),
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	            };
				
	        
			newMap = new google.maps.Map(element, mapOptions);  
			geocoder = geocoder = new google.maps.Geocoder();
			google.maps.event.trigger(newMap, 'resize');	
			
			
	        
			google.maps.event.addListener(newMap, 'dblclick', function(event) {
				for (var i = 0; i < markers.length; i++) {
				    markers[i].setMap(null);
				}
				markers = [];
			    var marker = new google.maps.Marker({
				    position: event.latLng,
				    map: newMap,
					animation : google.maps.Animation.DROP,
					draggable: true
				});
				google.maps.event.addListener(marker, 'rightclick', function(event) {
					for (var i = 0; i < markers.length; i++) {
					    markers[i].setMap(null);
					}
					markers = [];
				});
				google.maps.event.addListener(marker, "dragend", function (e) {
                    var lat, lng, address;
                    geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            lat = marker.getPosition().lat();
                            lng = marker.getPosition().lng();
                            //address = results[0].formatted_address;
                            //alert("Latitude: " + lat + "\nLongitude: " + lng + "\nAddress: " + address);
							self.newCoordinates(lat + ',' + lng);
                        }
                    });
                });
				self.newCoordinates(marker.getPosition().lat() + ',' + marker.getPosition().lng());
				markers.push(marker);
			});
	    }
	};
	
	ko.bindingHandlers.editPropertyGoogleMap = {
	    init: function (element, valueAccessor) {
	         var
	          value = valueAccessor(),			  
	          mapOptions = {
	            zoom: 10,
	            center: new google.maps.LatLng(9.927595, -84.082489),
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	            };
				
	        
			editMap = new google.maps.Map(element, mapOptions);  
			geocoder = geocoder = new google.maps.Geocoder();
			google.maps.event.trigger(editMap, 'resize');	
			markers = [];
	        
			google.maps.event.addListener(editMap, 'dblclick', function(event) {
				for (var i = 0; i < markers.length; i++) {
				    markers[i].setMap(null);
				}
				markers = [];
			    var marker = new google.maps.Marker({
				    position: event.latLng,
				    map: editMap,
					animation : google.maps.Animation.DROP,
					draggable: true
				});
				google.maps.event.addListener(marker, 'rightclick', function(event) {
					for (var i = 0; i < markers.length; i++) {
					    markers[i].setMap(null);
					}
					markers = [];
				});
				google.maps.event.addListener(marker, "dragend", function (e) {
                    var lat, lng, address;
                    geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            lat = marker.getPosition().lat();
                            lng = marker.getPosition().lng();
							self.editCoordinates(lat + ',' + lng);
                        }
                    });
                });
				self.editCoordinates(marker.getPosition().lat() + ',' + marker.getPosition().lng());
				markers.push(marker);
			});
	    }
	};
	
	ko.bindingHandlers.datepicker = {
		init : function(element, valueAccessor, allBindingsAccessor) {
			// initialize datepicker with some optional options
			var options = allBindingsAccessor().datepickerOptions || {};
			$(element).datepicker({todayHighlight: true});

			// when a user changes the date, update the view model
			ko.utils.registerEventHandler(element, "changeDate",
					function(event) {
						var value = valueAccessor();
						if (ko.isObservable(value)) {
							value($(element).val());
						}		
						$('.datepicker').hide();
					});
		},
		update : function(element, valueAccessor) {
			var widget = $(element).val();
			// when the view model is updated, update the widget
			if (widget) {
				widget.date = ko.utils.unwrapObservable(valueAccessor());
				if (widget.date) {
					widget.setValue();
				}
			}
		}
	};

	
	self.loadProperties();
	self.getProvincias();
	self.loadServices();	
};

ko.applyBindings(new propertiesViewModel());