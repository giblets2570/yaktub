app.controller('jobCtrl', ['$scope','$state','$stateParams','$location','$timeout','Job','Alert',function($scope,$state,$stateParams,$location,$timeout,Job,Alert){
	$scope.getShareableUrl = function(){
		var result = $location.protocol() + "://" + $location.host();
		if($location.host() == "localhost" && $location.port())
			result+=":"+$location.port();
		result += '/interview/'+$scope.job.url_name;
		$scope.shareableUrl = result;
	}
	$scope.getJob = function(){
		var job_name = $stateParams.job_name;
		Job.show({url_name: job_name}).then(function(data){
			$scope.job = data;
			$scope.job.send_email ? $scope.job.send_email_s = 'true' : $scope.job.send_email_s = 'false';
			console.log(data);
			$scope.getShareableUrl();
		})
	}
	$scope.changeSendEmail = function(){
		$scope.job.send_email_s == 'true' ? $scope.job.send_email = true : $scope.job.send_email = false;
		Job.update({send_email: $scope.job.send_email},$scope.job._id);
	}
	$scope.getJob();
	$scope.editDescription = function(){
		$scope.editing_description ?  $scope.job.description = $scope.oldDescription : $scope.oldDescription = $scope.job.description.toString();
		$scope.editing_description = !$scope.editing_description;
	}
	$scope.saveDescription = function(){
		$scope.editing_description = !$scope.editing_description;
		Job.update({description: $scope.job.description},$scope.job._id);
	}
	$scope.editName = function(){
		$scope.editing_name = !$scope.editing_name;
	}
	$scope.saveName = function(){
		$scope.editing_name = !$scope.editing_name;
		Job.update({name: $scope.job.name},$scope.job._id).then(function(data){
			var url_name = data.url_name;
			$state.go('home.job',{job_name: url_name});
		})
	}
	$scope.editTimer = function(){
		$scope.editing_timer = !$scope.editing_timer;
	}
	$scope.saveTimer = function(){
		$scope.editing_timer = !$scope.editing_timer;
		if($scope.job.timer < 1) $scope.job.timer = 1;
		Job.update({timer: $scope.job.timer},$scope.job._id);
	}
	$scope.editEmail = function(){
		$scope.editing_email = !$scope.editing_email;
	}
	$scope.saveEmail = function(){
		$scope.editing_email = !$scope.editing_email;
		Job.update({email: $scope.job.email},$scope.job._id);
	}
	$scope.addQuestion = function(){
		$scope.adding_question = !$scope.adding_question;
	}
	$scope.saveQuestion = function(){
		$scope.adding_question = !$scope.adding_question;
		$scope.job.questions.push({text: $scope.new_question});
		var new_question = $scope.new_question;
		$scope.new_question = '';
		Job.update({questions:$scope.job.questions,question: new_question},$scope.job._id)
	}
	$scope.deleteQuestion = function(index){
		$scope.job.questions.splice(index,1);
		Job.update({questions:$scope.job.questions},$scope.job._id);
	}
	$scope.editQuestion = function(question){
		question.editing = !question.editing;
	}
	$scope.saveQuestionEdit = function(question){
		question.editing = !question.editing;
		Job.update({questions:$scope.job.questions},$scope.job._id);
	}
	$scope.success = function () {
      console.log('Copied!');
      var countdown;
      Alert.success("Copied!").then(function(loading){
      	loading.show();
      	countdown = $timeout(function(){
			loading.hide();
		},1000);
      });
  };

  $scope.fail = function (err) {
    console.error('Error!', err);
  };
}])