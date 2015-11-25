/**
* app.services Module
*
* Description
*/
angular.module('app.services', [])

.factory('Client', ['$q','$http', function($q,$http){
	return {
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
			$http.get('/api/jobs',query)
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
		}
	}
}])