app.controller('detailsCtrl', ['$scope','$state','$stateParams','Job','Applicant',function($scope,$state,$stateParams,Job,Applicant){
	$scope.user = {};
	$scope.job_name = $stateParams.job_name;
	$scope.getJob = function(){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job_id = data._id;
			console.log("yay");
		}, function(error){
			$state.go('error.description',{error_id: 1});
		});
	}
	$scope.getJob();
	$scope.saveDetails = function(){
		Applicant.create({
			name: $scope.user.name,
			email: $scope.user.email,
			phone: $scope.user.phone,
			job: $scope.job_id
		}).then(function(data){
			$state.go('interview.take',{job_name: $scope.job_name, applicant_id: data._id})
		})
	}
}])