/**
* adminApp Module
*
* Description
*/
angular.module('adminApp', [])

.controller('adminCtrl', function($scope,$sce,$http){
	$scope.filter = {
		followed_up: false
	}
	$scope.getApplicants = function(){
		$http({
			method: 'GET',
			url: '/api/applicants',
			cache: false
		}).success(function(data){
			$scope.applicants = data;
			for (var i = $scope.applicants.length - 1; i >= 0; i--) {
				if($scope.applicants[i].recording_url == '')
					$scope.applicants.splice(i, 1);
			};
		})
	}
	$scope.getApplicants();

	// Required in order to play HTML5 audio on the page
	$scope.getTrustedUrl = function(url){
		return $sce.trustAsResourceUrl(url);
	}

	$scope.getStyle = function(applicant){
		return applicant.followed_up ? 'background: #2ecc71' : '';
	};

	$scope.followed = function(applicant){
		$http({
			method: 'PUT',
			url: '/api/applicants/'+applicant._id,
			data: {
				followed_up: applicant.followed_up
			},
			cache: false
		}).success(function(data){
			console.log(data);
		})
	}
})

.filter('followedFilter',function(){
	return function(input, followed_up){
		if(!followed_up) return input;
		var result = [];
		for (var i = 0; i < input.length; i++) {
			if(input[i].followed_up)
				result.push(input[i])
		};
		return result;
	}
})