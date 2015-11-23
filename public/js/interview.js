/**
* interviewApp Module
*
* Description
*/
angular.module('interviewApp', [])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.controller('interviewCtrl', function($scope,$location,$http,$interval,$timeout,$window,$sce){

	$scope.audios = [];
	$scope.questions = [];
	$scope.index = -1;
	$scope.showEnd = function(){
		return ($scope.index == $scope.audios.length && $scope.timer < 0)
	}
	$scope.getNextAudio = function(){
		// $scope.index+=1;
		return $scope.audios[$scope.index]
	}
	$scope.increment = function(){
		$scope.index += 1;
		$scope.timer = 10;
	}
	$scope.getTrustedUrl = function(url){
		return $sce.trustAsResourceUrl(url);
	}
	$scope.question = function(i){
		return (i == $scope.index)
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
	$scope.getCampaign = function(){
		$http({
			method: 'GET',
			url: '/api/campaigns/mine',
			cache: false
		}).success(function(data){
			$scope.campaign = data;
			for (var i = 0; i < $scope.campaign.questions.length; i++) {
				$scope.audios.push($scope.campaign.questions[i].recording_url);
				$scope.questions.push($scope.campaign.questions[i].transcription_text)
			};
		})
	}
	$scope.getCampaign();
	$scope.show = function(i){
		return (i == $scope.index && $scope.timer < 0)
	}
	$scope.getApplicantId = function(){
		var params = $location.search();
		console.log(params)
		if (params.oid){
			$scope.applicant = params.oid;
		}else{
			var pathArray = $window.location.pathname.split('/');
			var path = pathArray[0];
			for (var i = 1; i < 3; i++) {
				path = path + '/'+ pathArray[i];
			};
			$window.location.href=path;
		}
		$scope.twilioSetup();
	}
	$scope.getApplicantId();

	$scope.startInterview = function(){
		$scope.increment();
		$scope.timer = -1;
		// $http({
		// 	method:'POST',
		// 	url:'/api/applicants/start',
		// 	data: {
		// 		applicant: $scope.applicant
		// 	},
		// 	cache:false
		// }).success(function(data){
		// 	console.log(data);
		// })
		Twilio.Device.connect({
			applicant: $scope.applicant
		});
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