/**
* dashboardApp Module
*
* Description
*/
angular.module('dashboardApp', [])

.controller('dashboardCtrl', function($scope,$http,$window){
	$scope.getCampaigns = function(){
		$http({
			url: '/api/campaigns',
			method: 'GET',
			cache: false
		}).success(function(data){
			$scope.campaigns = data;
		})
	}
	$scope.getCampaigns();

	$scope.makeNewCampaign = function(){
		$scope.make_campaign = !$scope.make_campaign
	}
	$scope.viewCampaign = function(campaign){
		$window.location.href = '/dashboard/'+campaign.url_name;
	}
	$scope.saveCampaign = function(){
		$scope.make_campaign = !$scope.make_campaign;
		$http({
			url: '/api/campaigns',
			method: 'POST',
			data: {
				name: $scope.campaign_name
			},
			cache: false
		}).success(function(data){
			$scope.campaign_name = '';
			$scope.campaigns.push(data);
		})
	}
})