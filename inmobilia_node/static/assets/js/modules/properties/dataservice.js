
var ajaxService = new ajaxService();

function dataService() {

	var self = this;
	
	self.getServices = function(callback, errorCallback) {
		ajaxService.get({
			url : "services/list",
			success : callback,
			error : errorCallback
		});
	};
	
	self.getProvinces = function(callback, errorCallback) {
		ajaxService.get({
			url : "locations/provinces/",
			success : callback,
			error : errorCallback
		});
	};
	
	self.getCantones = function(provincia, callback, errorCallback) {
		ajaxService.get({
			url : "locations/cantones/?provincia=" + provincia,
			success : callback,
			error : errorCallback
		});
	};
	
	self.getDistritos = function(provincia, canton, callback, errorCallback) {
		ajaxService.get({
			url : "locations/distritos/?provincia=" + provincia + "&canton=" + canton,
			success : callback,
			error : errorCallback
		});
	};
	
	self.getProperties = function(callback, errorCallback) {
		ajaxService.get({
			url : "properties/list",
			success : callback,
			error : errorCallback
		});
	};
	
	self.insertProperty = function(property, callback, errorCallback) {
		ajaxService.post({
			url : "properties/add",
			data : property,
			success : callback,
			error : errorCallback
		});
	};
	
	self.editProperty = function(property, callback, errorCallback) {
		ajaxService.put({
			url : "properties/edit",
			data : property,
			success : callback,
			error : errorCallback
		});
	};
	
	self.removePropertyImage = function(property, callback, errorCallback) {
		ajaxService.delete({
			url : "properties/image",
			data : property,
			success : callback,
			error : errorCallback
		});
	};
	
};