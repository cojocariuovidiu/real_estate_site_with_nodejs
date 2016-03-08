function ajaxService(){
	
	var self = this;	


	self.getBaseURL = function(){
		var pathArray = window.location.href.split( '/' );
		var protocol = pathArray[0];
		var host = pathArray[2];
		var url = protocol + '//' + host + '/';
		return url;
	};	
	
	// keys
	var baseURL = self.getBaseURL();
	
	// ajax calls
	$.support.cors = true;
	
	self.get = function (options) {    
		
	    var ajaxOptions = {
	        url: baseURL + options.url,
	        type: 'GET',
	        success: options.success,
	        data: options.data,
	        error: options.error        
	    };
	
	    self.executeAjax(ajaxOptions);
	};
	
	self.put = function (options) {
		
	    var ajaxOptions = {
	        type: 'PUT',
	        url: baseURL + options.url,
	        success: options.success,
	        data: options.data,
	        error: options.error
	    };
	    
	    self.executeAjax(ajaxOptions);
	    
	};
	
	self.post = function (options) {
		
	    var ajaxOptions = {
	        type: 'POST',
	        url: baseURL + options.url,
	        success: options.success,
	        data: options.data,
	        error: options.error
	    };
	    
	    self.executeAjax(ajaxOptions);
	    
	};
	
	self.postFile = function (options) {
		
	    var ajaxOptions = {
	        type: 'POST',
	        url: baseURL + options.url,
	        success: options.success,
	        data: options.data,
	        dataType:"text",
	        error: options.error,
	        processData: false,
	        contentType: false
	    };
	    $.ajax(ajaxOptions);
	    //self.executeAjax(ajaxOptions);
	    
	};
	
	
	self.deleteAjax = function (options) {
	    
	    var ajaxOptions = {
	        type: 'DELETE',
	        url: baseURL + options.url,
	        success: options.success,
	        error: options.error
	    };
	    
	    self.executeAjax(ajaxOptions);
	    
	};
	
	
	self.executeAjax = function(ajaxOptions){
		$.ajax({
			url: ajaxOptions.url,
					
	        dataType: "json",
	        type: ajaxOptions.type,
	        contentType: "application/json",
	        success: ajaxOptions.success,
	        data: ajaxOptions.data,
	        cache: false,
	        // timeout: getTimeout(options.type),
	        error: ajaxOptions.error
		});
	};	
};