/**
* app.services Module
*
* Description
*/
angular.module('app.services', ['mgcrea.ngStrap'])

.factory('Client', ['$q','$http', function($q,$http){
	return {
		show : function(id){
			var defered = $q.defer();
			$http.get('/api/clients/'+id)
		    .success(function(user){
		      // No error: authentication OK
		      defered.resolve(user);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		update: function(data,id){
			var defered = $q.defer();
			$http({
				method: 'PUT',
				url: '/api/clients/'+id,
				data: data,
				cache: false
			}).success(function(data){
				defered.resolve(data);
			}).error(function(error){
				defered.reject(error);
			})
			return defered.promise;
		},
		login : function(user){
			var defered = $q.defer();
			$http.post('/auth/login', {
		      username: user.username,
		      password: user.password,
		    })
		    .success(function(user){
		      // No error: authentication OK
		      defered.resolve(user);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		signup : function(user){
			var defered = $q.defer();
			$http.post('/auth/signup', {
		      username: user.username,
		      password: user.password,
		    })
		    .success(function(user){
		      // No error: authentication OK
		      defered.resolve(user);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		logout : function(user){
			var defered = $q.defer();
			$http.get('/auth/logout')
		    .success(function(user){
		      defered.resolve(user);
		    })
		    .error(function(){
		      defered.reject('0');
		    });
		    return defered.promise;
		}
	}
}])

.factory('Applicant', ['$q','$http', function($q,$http){
	return {
		get: function(params){
			var defered = $q.defer();
			$http({
				method: 'GET',
				url:'/api/applicants',
				params: params
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		show: function(params,fields,id){
			if(fields)
				params.fields = fields;
			var defered = $q.defer();
			$http({
				method: 'GET',
				url:'/api/applicants/'+id,
				params: params
			}).success(function(data){
		      defered.resolve(data);
		    }).error(function(){
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		update: function(data,id){
			var defered = $q.defer();
			$http({
				method: 'PUT',
				url:'/api/applicants/'+id,
				data: data
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		create: function(data){
			var defered = $q.defer();
			$http({
				method: 'POST',
				url:'/api/applicants',
				data: data
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		answer: function(data){
			var defered = $q.defer();
			$http({
				method: 'POST',
				url:'/api/applicants/answer',
				data: data
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		twilio: function(applicant){
			var defered = $q.defer();
			$http({
				method: 'GET',
				url:'/api/applicants/twilio',
				params: {
					applicant: applicant
				},
				cache: false
			}).success(function(data){
				defered.resolve(data);
			}).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		}
	}
}])

.factory('Job', ['$q','$http', function($q,$http){
	return {
		get: function(query,fields){
			if(fields)
				query.fields = fields;
			var defered = $q.defer();
			$http({
				method: 'GET',
				url:'/api/jobs',
				params: query
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		show: function(query,fields){
			if(fields)
				query.fields = fields;
			var defered = $q.defer();
			$http({
				method: 'GET',
				url: '/api/jobs/query',
				params: query,
				cache: false
			}).success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    }).error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		create: function(data){
			var defered = $q.defer();
			$http.post('/api/jobs', data)
		    .success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		update: function(data,id){
			var defered = $q.defer();
			$http.put('/api/jobs/'+id, data)
		    .success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		},
		finish: function(id,applicant_id){
			var defered = $q.defer();
			$http({
				method: 'GET',
				url: '/api/jobs/'+id+'/finish/'+applicant_id,
				cache: false
			})
		    .success(function(data){
		      // No error: authentication OK
		      defered.resolve(data);
		    })
		    .error(function(){
		      // Error: authentication failed
		      defered.reject('0');
		    });
		    return defered.promise;
		}
	}
}])

.factory('Alert', ['$alert','$q',function($alert,$q){
	return {
		success: function(title,content){
			var defered = $q.defer();
	  		var alert = $alert({
				title: title,
				content: content,
				placement: 'floater-top-left', 
				type: 'success',
				duration: 3,
				show: false
		  	});
		  	alert.$promise.then(function(){
		  		defered.resolve(alert);
		  	})
		  	return defered.promise;
		},
		warning: function(title,content){
	  		var defered = $q.defer();
	  		var alert = $alert({
				title: title,
				content: content,
				placement: 'floater-top-left', 
				type: 'warning',
				duration: 3,
				show: false
		  	});
		  	alert.$promise.then(function(){
		  		defered.resolve(alert);
		  	})
		  	return defered.promise;
	  	}
	}
}]);