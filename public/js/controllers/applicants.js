app.controller('applicantsCtrl', ['$scope','$state','$stateParams','$filter','$location','Job','Applicant', function($scope,$state,$stateParams,$filter,$location,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.show_filtered = true;
	// Number of entries shown per page
	$scope.page_entries = '5';
	$scope.num_of_pages = 1;
	$scope.filter = {
		search_text:'',
		page: 0,
		stars:[true,true,true,true],
		page_entries: 5
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
	$scope.changePageEntries = function(){
		$scope.filter.page_entries = parseInt($scope.page_entries);
	}
	// Returns the class of the star icon. If rating is less that value, return
	// an empty star, and vice versa.
	$scope.star = function(rating, value){
		return ((rating >= value) ? 'glyphicon glyphicon-star' :  'glyphicon glyphicon-star-empty');
	}
	// Function that does the star rating.
	$scope.scoreApplicant = function(applicant,num){
		applicant.score==1 && num==1 ? applicant.score = 0 : applicant.score = num;
		Applicant.update({score: applicant.score},applicant._id).then(function(data){
		});
	}
	// When the star is changed, we update the url query string
	$scope.changeStar = function(star){
		$scope.filter.stars[star] = !$scope.filter.stars[star]
		var oneFalse = false
		for (var i = $scope.filter.stars.length - 1; i >= 0; i--) {
			if(!$scope.filter.stars[i])
				oneFalse = true
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
			$scope.num_of_pages = Math.ceil($scope.total_items / $scope.filter.page_entries);
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
	return function(applicants, params){
		if(!applicants||!params||!params.stars) return applicants;
		console.log(params);
		var result = [];
		for (var i = 0; i < applicants.length; i++) {
			if(!params.stars[applicants[i].score]){continue;}
			// if(!applicants[i].followed_up)
			result.push(applicants[i])
		};
		return result;
	}
})