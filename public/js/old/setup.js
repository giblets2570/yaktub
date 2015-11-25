/**
* setupApp Module
*
* Description
*/
angular.module('setupApp', [])

.controller('setupCtrl', function($scope,$http,$window,$location){
	$scope.data = {}
	$scope.submit = function(){
		$http({
			method: 'POST',
			url:'/api/applicants',
			data: $scope.data,
			cache: false
		}).success(function(data){
			console.log(data);
			var pathArray = $window.location.pathname.split('/');
			var path = pathArray[0];
			for (var i = 1; i < pathArray.length; i++) {
				path = path + '/'+ pathArray[i];
			};
			path += '/interview?oid='+data._id
			$window.location.href=path;
		})
	}
})