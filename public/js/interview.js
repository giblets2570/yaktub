/**
* interviewApp Module
*
* Description
*/
angular.module('interviewApp', [])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.controller('interviewCtrl', function($scope,$location,$http,$interval,$timeout,$window){

	$scope.audios = ['assets/audio/audio3.m4a','assets/audio/audio4.m4a','assets/audio/audio5.m4a','assets/audio/audio6.m4a','assets/audio/audio7.m4a'];
	$scope.index = -1;
	$scope.getNextAudio = function(){
		// $scope.index+=1;
		return $scope.audios[$scope.index]
	}
	$scope.increment = function(){
		$scope.index += 1;
		$scope.timer = 15;
	}

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
	$scope.show = function(i){
		return (i == $scope.index && $scope.timer < 0)
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
		$scope.increment();
		$scope.timer = -1;
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
		$timeout(function(){
			$window.location.href = '/thankyou'
		},1500);
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

    $interval(function(){
		$scope.timer-=1;
		console.log($scope.timer);
	},1000)
})