app.controller('errorCtrl', ['$scope','$state','$stateParams',function($scope,$state,$stateParams){
	$scope.error_id = $stateParams.error_id;
	$scope.error_messages = {
		1: 'This job does not exist!',
		2: 'You have already started this interview on a previous date!'
	}
}]);