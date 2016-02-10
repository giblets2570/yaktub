app.factory('Job', ['$q','$http', function($q,$http){
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