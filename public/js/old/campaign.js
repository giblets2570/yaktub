/**
* campaignApp Module
*
* Description
*/
angular.module('campaignApp', [])

.controller('campaignCtrl', function($scope,$http,$sce,$interval,$window){
	var check;
	var length;
	$scope.loading = false;
	$scope.getCampaign = function(c){
		$http({
			method: 'GET',
			url: '/api/campaigns/mine',
			cache: false
		}).success(function(data){
			$scope.campaign = data;
			(c || angular.noop)()
		})
	}
	$scope.viewApplicants = function(){
		var pathArray = $window.location.pathname.split('/');
		var path = pathArray[0];
		for (var i = 1; i < pathArray.length; i++) {
			path = path + '/'+ pathArray[i];
		};
		path += '/applicants'
		$window.location.href=path;
	}
	$scope.getUpdatedCampaign = function(c){
		$http({
			method: 'GET',
			url: '/api/campaigns/mine',
			cache: false
		}).success(c)
	}
	$scope.editDescription = function(){
		console.log("Eh..")
		$scope.edit_description = !$scope.edit_description;
	}
	$scope.getCampaign();
	$scope.updateCampaign = function(type){
		if(type == 'edit')
			$scope.edit_description = !$scope.edit_description;
		$http({
			method: 'PUT',
			url: '/api/campaigns/'+$scope.campaign._id,
			data: $scope.campaign,
			cache: false
		}).success(function(data){
			console.log(data);
		})
	}

	$scope.makeNewQuestion = function(){
		$scope.making_question = true;
		Twilio.Device.connect({
			campaign: $scope.campaign._id
		});
		// $http({
		// 	method: 'POST',
		// 	url:'/api/campaigns/make',
		// 	data: {
		// 		campaign: $scope.campaign._id
		// 	},
		// 	cache: false
		// }).success(function(data){
		// 	console.log(data);
		// })
	}

	// Required in order to play HTML5 audio on the page
	$scope.getTrustedUrl = function(url){
		return $sce.trustAsResourceUrl(url);
	}

	$scope.endQuestion = function(){
		$scope.making_question = false;
		Twilio.Device.disconnectAll();
		length = $scope.campaign.questions.length;
		$scope.loading = true;
		$scope.loading_message = 'Loading.';
		check = $interval(function(){
			console.log("Running check");
			$scope.loading_message+='.'
			$scope.getUpdatedCampaign(function(data){
				if(data.questions.length > length){
					$scope.campaign = data;
					$scope.stopCheck();
				}
			});
		},1500);
	}
	$scope.stopCheck = function(){
		if (angular.isDefined(check)) {
	        $interval.cancel(check);
	        check = undefined;
	        length = undefined;
	        $scope.loading = false;
	        console.log("Stopping check");
      	}
	}

	$scope.twilioSetup = function(){
		$http({
			method: 'GET',
			url:'/api/clients/twilio',
			cache: false
		}).success(function(data){
			Twilio.Device.setup(data);
		})
	}

	$scope.twilioSetup();

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