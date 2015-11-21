/**
* setupApp Module
*
* Description
*/
angular.module('setupApp', [])

.controller('setupCtrl', function($scope,$http,$window){
	$scope.data = {}
	$scope.submit = function(){
		$http({
			method: 'POST',
			url:'/api/applicants',
			data: $scope.data,
			cache: false
		}).success(function(data){
			console.log(data);
			$window.location.href='/interview?oid='+data._id
		})
	}
})