/**
* dashboardApp Module
*
* Description
*/
angular.module('dashboardApp', [])

.controller('dashboardCtrl', function($scope,$http,$window){
	$scope.getCampaigns = function(){
		$http({
			url: '/api/campaigns/mine',
			method: 'GET',
			cache: false
		}).success(function(data){
			$scope.campaigns = data;
		})
	}
	$scope.getCampaigns();

	$scope.makeNewCampaign = function(data){
		$http({
			url: '/api/campaigns',
			method: 'POST',
			data: data
			cache: false
		}).success(function(data){
			$window.location.href = '';
		})
	}
})