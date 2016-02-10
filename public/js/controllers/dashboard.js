app.controller('dashboardCtrl',['$scope','$state','Job','Alert',function($scope,$state,Job,Alert){
	$scope.getJobs = function(){
		Job.get({mine:true},'name url_name').then(function(data){
			$scope.jobs = data;
		})
	}
	$scope.getJobs();
	$scope.newJob = function(){
		$scope.making_job = !$scope.making_job
	}
	$scope.saveJob = function(){
		$scope.making_job = !$scope.making_job;
		Alert.success("Adding new job...").then(function(loading){
			loading.show();
			Job.create({
				name: $scope.new_job_name
			}).then(function(data){
				$scope.jobs.push(data);
				loading.hide();
				$state.go('home.job',{job_name: data.url_name});
			});
		});
	}
}])