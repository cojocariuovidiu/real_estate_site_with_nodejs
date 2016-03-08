function callbackHelper() {
	
	var self = this;
	
	// keys
	var fadeTime = 5000;

	// helper functions
	self.showSuccessMessage = function(message, elementToAppend) {
		/*if (typeof elementToAppend === 'undefined') {
			elementToAppend = "#successErrorSection";
		}
		$(elementToAppend).append(
				'<div class="alert alert-success">' + message + '</div>');
		window.setTimeout(function() {
			$(".alert-success").fadeTo(500, 0).slideUp(500, function() {
				$(this).remove();
			});
		}, fadeTime);*/
		swal("Success!", message, "success");
	};

	self.highlightEditItem = function(idTD) {
		var highlightedTD = $('#highlight' + idTD);
		highlightedTD.removeClass().addClass("alert-success-no-fade");
		window.setTimeout(function() {
			highlightedTD.removeClass();
		}, fadeTime);
	};

	self.highlight = function(id) {
		var highlighted = $(id);
		highlighted.addClass("alert-success-no-fade border-success");
		window.setTimeout(function() {
			highlighted.removeClass("alert-success-no-fade border-success");
		}, fadeTime);
	};

	self.showErrorMessage = function(message, elementToAppend) {
		/*if (typeof elementToAppend === 'undefined') {
			elementToAppend = "#successErrorSection";
		}
		$(elementToAppend).append(
				'<div class="alert alert-danger">' + message + '</div>');
		window.setTimeout(function() {
			$(".alert-danger").fadeTo(500, 0).slideUp(500, function() {
				$(this).remove();
			});
		}, fadeTime);*/
		swal("Error!", message, "error");
	};

	self.showPermanentError = function(message, elementToAppend) {
		if (typeof elementToAppend === 'undefined') {
			elementToAppend = "#successErrorSection";
		}
		$(elementToAppend).empty();
		$(elementToAppend).append(
				'<div class="alert alert-danger">' + message + '</div>');
	};
	
	self.removePermanentError = function(elementToAppend) {
		if (typeof elementToAppend === 'undefined') {
			elementToAppend = "#successErrorSection";
		}
		$(elementToAppend).empty();
	};

	self.areFieldsValid = function(object) {
		var validationModel = ko.validatedObservable(object);
		if (!validationModel.isValid()) {
			ko.validation.group(object, {
				deep : true
			}).showAllMessages(true);
			return false;
		}
		return true;
	};

	self.resetFieldsModified = function(object) {
		for ( var key in object) {
			if (object.hasOwnProperty(key)
					&& object[key].hasOwnProperty('isModified')) {
				object[key].isModified(false);
			}
		}
	};
}