/**
* interviewApp Module
*
* Description
*/
angular.module('interviewApp', [])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.controller('interviewCtrl', function($scope,$location,$http){
	$scope.twilioSetup = function(){
		$http({
			method: 'GET',
			url:'/api/applicants/twilio',
			params: {
				applicant: $scope.applicant
			},
			cache: false
		}).success(function(data){
			Twilio.Device.setup(data);
		})
	}
	$scope.getApplicantId = function(){
		var params = $location.search();
		console.log(params)
		if (params.oid){
			$scope.applicant = params.oid;
			// $location.search('oid',null);
		}
		$scope.twilioSetup();
	}
	$scope.getApplicantId();

	$scope.startInterview = function(){
		Twilio.Device.connect({
			applicant: $scope.applicant
		});
		// $http({
		// 	method: 'POST',
		// 	url:'/api/applicants/start',
		// 	data: {
		// 		applicant: $scope.applicant
		// 	},
		// 	cache: false
		// }).success(function(data){
		// 	console.log(data);
		// })
	}
	$scope.endInterview = function(){
		Twilio.Device.disconnectAll();
	}

	//Twilio javascript
    Twilio.Device.ready(function (device) {
        // console.log(device);
        $scope.call_button_text = 'Call';
        $scope.$apply();
    });

    Twilio.Device.error(function (error) {
    	// console.log(error);
    	$scope.call_button_text = 'Session expired, refresh page';
        $scope.$apply();
    });

    Twilio.Device.connect(function (conn) {
    	// console.log(conn);
    });

    Twilio.Device.disconnect(function (conn) {
        // console.log(conn);
    });
})