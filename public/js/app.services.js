/**
* app.services Module
*
* Description
*/
angular.module('app.services', ['mgcrea.ngStrap','ngFileUpload'])

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

.factory('Applicant', ['$q','$http', 'Upload',function($q,$http,Upload){
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
		sendFile: function(file){
			var defered = $q.defer();
			$http({
				method:'GET',
				url:'/api/applicants/upload',
				cache: false
			}).success(function(data){
				var ext = '.'+file.name.split('.').pop();
				Upload.upload({
				    url: 'https://yakhub-chats.s3.amazonaws.com/', //S3 upload url including bucket name
				    method: 'POST',
				    data: {
				        key: 'uploads/'+(new Date()).getTime()+randomString(16)+ext, // the key to store the file on S3, could be file name or customized
				        AWSAccessKeyId: data.key,
				        acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
				        policy: data.policy, // base64-encoded json policy (see article below)
				        signature: data.signature, // base64-encoded signature based on policy string (see article below)
				        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
				        // filename: file.name, // this is needed for Flash polyfill IE8-9
				        file: file
				    }
				}).then(function (resp) {
		            defered.resolve(resp);
		        }, function (error) {
		            defered.reject(error);
		        }, function (evt) {
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });
			}).error(function(error){
				defered.reject(error);
			})
			return defered.promise
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
		success: function(title,content,duration){
			var defered = $q.defer();
	  		var alert = $alert({
				title: title,
				content: content,
				placement: 'floater-top-left', 
				type: 'success',
				duration: duration,
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

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];

	return result;
};