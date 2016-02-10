app.controller('loginCtrl', ['$scope','$state','Client','Alert',function($scope,$state,Client,Alert){
	$scope.user_login = {};
	$scope.user_signup = {
		username: {}
	};
	$scope.login = function(){
		Alert.success("Loading...").then(function(loading){
			loading.show();
			Client.login($scope.user_login).then(function(data){
				loading.hide();
		    $state.go('home.dashboard')
	    }, function (error) {
	    	loading.hide();
	    	Alert.warning('Login credentials wrong!','',3).then(function(alert){
	    		alert.show();
	    	});
	    	$scope.user_login = {};
	    });
		})
	};
	$scope.signup = function(){
		Alert.success("Loading...").then(function(loading){
			loading.show();
	    Client.signup($scope.user_signup).then(function(data){
				loading.hide();
		    $state.go('home.dashboard')
	    }, function (error) {
	    	loading.hide();
	    	Alert.warning('Login credentials wrong!','',3).then(function(alert){
	    		alert.show();
	    	});
	    	$scope.user_signup = {
				username: {}
			};
	    });
		})
	};
}])
