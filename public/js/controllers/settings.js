app.controller('settingsCtrl', ['$scope','Client', function($scope,Client){
	$scope.getClient = function(){
		Client.show($scope.user._id).then(function(data){
			console.log(data);
			$scope.user = data;
		});
	}
	$scope.getClient();
	$scope.editName = function(){
		$scope.editing_name = !$scope.editing_name;
	}
	$scope.saveName = function(){
		$scope.editing_name = !$scope.editing_name;
		Client.update({name: $scope.user.name},$scope.user._id).then(function(data){
			console.log("Saved new name!")
		})
	}
	$scope.editCompany = function(){
		$scope.editing_company = !$scope.editing_company;
	}
	$scope.saveCompany = function(){
		$scope.editing_company = !$scope.editing_company;
		Client.update({company_name: $scope.user.company_name},$scope.user._id).then(function(data){
			console.log("Saved new company name!")
		})
	}
	$scope.editEmail = function(){
		$scope.editing_email = !$scope.editing_email;
	}
	$scope.saveEmail = function(){
		$scope.editing_email = !$scope.editing_email;
		Client.update({email: $scope.user.email},$scope.user._id).then(function(data){
			console.log("Saved new email!")
		})
	}
	$scope.editPassword = function(){
		$scope.editing_password = !$scope.editing_password;
	}
	$scope.savePassword = function(){
		$scope.editing_password = !$scope.editing_password;
		Client.update({old_password: $scope.old_password,new_password: $scope.new_password},$scope.user._id).then(function(data){
			console.log("Saved new password!")
		})
	}
}])