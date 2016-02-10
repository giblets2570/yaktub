app.controller('interviewCtrl', ['$scope','$modal',function($scope,$modal){
	$scope.timeLimit = 10;
	var microphoneTestmodal = $modal({scope: $scope, templateUrl: '../templates/microphone-test.html', show: false});
	$scope.showmicrophoneTestmodal = function() {
		microphoneTestmodal.$promise.then(microphoneTestmodal.show);
	};
}])