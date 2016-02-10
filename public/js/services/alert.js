app.factory('Alert', ['$alert','$q',function($alert,$q){
	return {
		success: function(title,content,duration,placement){
			var defered = $q.defer();
			if(!placement){placement='floater-top-left'}
	  		var alert = $alert({
				title: title,
				content: content,
				placement: placement,
				type: 'success',
				duration: duration,
				show: false
		  	});
		  	alert.$promise.then(function(){
		  		defered.resolve(alert);
		  	})
		  	return defered.promise;
		},
		warning: function(title,content,duration,placement){
	  		var defered = $q.defer();
	  		if(!placement){placement='floater-top-left'}
	  		var alert = $alert({
				title: title,
				content: content,
				placement: placement,
				type: 'warning',
				duration: duration,
				show: false
		  	});
		  	alert.$promise.then(function(){
		  		defered.resolve(alert);
		  	})
		  	return defered.promise;
	  	}
	}
}]);