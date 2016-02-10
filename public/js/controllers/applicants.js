app.controller('applicantsCtrl', ['$scope','$state','$stateParams','$filter','$location','Job','Applicant', function($scope,$state,$stateParams,$filter,$location,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.show_filtered = true;
	// Number of entries shown per page
	$scope.page_entries = 5;
	$scope.num_of_pages = 1;
	$scope.filter = {
		search_text:'',
		page: 0
	}
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
				$scope.applyFilter(true);
			})
		}else{
			Applicant.get({job: $scope.job._id}).then(function(data){
				$scope.applicants = data;
				$scope.applyFilter(true);
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
		});
	}
	$scope.followedUp = function(applicant){
		Applicant.update({followed_up: applicant.followed_up},applicant._id).then(function(data){
		});
	}
	$scope.isFollowed = function(applicant){
		return applicant.followed_up ? 'followed-up' : '';
	}
	// When the filter changes, we need to update the number of pages that we can access.
	// This function uses $filter to find the actual number of shown pages.
	$scope.applyFilter = function(newVal){
		if(!$scope.applicants) return;
		$scope.filtered = $filter('applicantsFilter')($scope.applicants, newVal);
		if($scope.filtered){
			$scope.total_items = $scope.filtered.length;
			$scope.num_of_pages = Math.ceil($scope.total_items / $scope.page_entries);
		}
	}
	// Helper function that gets an array of numbers, for the pages.
	$scope.getNumber = function(num) {
	    var result = []
	    for (var i = 0; i < num; i++)
	    	result.push(i)
	    return result
	}
	// When the page is changed, we update the url query string
	$scope.changePage = function(value){
		console.log("Here",$scope.num_of_pages,$scope.applicants.length);
		if(value < 0){return;}
		if(value > $scope.num_of_pages-1){return;}
		$scope.filter.page = value;
		$location.search("page",$scope.filter.page+1);
	}
	$scope.$watch('applicantsFilter', function (newVal, oldVal) {
		$scope.applyFilter(newVal);
	}, true);
}])

.filter('applicantsFilter', function(){
	return function(applicants, show_filtered){
		if(!applicants||show_filtered) return applicants;
		var result = [];
		for (var i = 0; i < applicants.length; i++) {
			if(!applicants[i].followed_up)
				result.push(applicants[i])
		};
		return result;
	}
})