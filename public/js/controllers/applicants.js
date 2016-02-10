app.controller('applicantsCtrl', ['$scope','$state','$stateParams','Job','Applicant', function($scope,$state,$stateParams,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.show_filtered = true;
	$scope.getJob = function(c){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			(c || angular.noop)();
		});
	}
	$scope.getApplicants = function(){
		if($scope.applicant_id){
			Applicant.show({},'',$scope.applicant_id).then(function(data){
				$scope.applicants = [data];
				console.log(data);
			})
		}else{
			Applicant.get({job: $scope.job._id}).then(function(data){
				$scope.applicants = data;
				console.log(data);
			})
		}
	}
	$scope.getJob($scope.getApplicants);
	$scope.editNotes = function(applicant){
		applicant.editing_notes = !applicant.editing_notes;
	}
	$scope.saveNotes = function(applicant){
		applicant.editing_notes = !applicant.editing_notes;
		Applicant.update({notes: applicant.notes},applicant._id).then(function(data){
			console.log(data);
		});
	}
	$scope.followedUp = function(applicant){
		Applicant.update({followed_up: applicant.followed_up},applicant._id).then(function(data){
			console.log(data);
		});
	}
	$scope.isFollowed = function(applicant){
		return applicant.followed_up ? 'followed-up' : '';
	}
}])

.filter('applicantsFilter', function(){
	return function(applicants, show_filtered){
		if(show_filtered) return applicants;
		var result = [];
		for (var i = 0; i < applicants.length; i++) {
			if(!applicants[i].followed_up)
				result.push(applicants[i])
		};
		return result;
	}
})