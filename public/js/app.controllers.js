/**
* appControllers Module
*
* Description
*/
angular.module('app.controllers', ['app.services'])

.controller('loginCtrl', ['$scope','$state','Client',function($scope,$state,Client){
	$scope.user = {
		username: 'Tom Keohane Murray',
		password: 'bogaboga'
	};
  // Register the login() function
  $scope.login = function(){
    Client.login($scope.user).then(function(data){
    	$state.go('home.dashboard')
    }, function (error) {
    });
  };
}])

.controller('homeCtrl', ['$scope','$state','Client',function($scope,$state,Client){
	$scope.logout = function(){
    Client.logout().then(function(data){
    	$state.go('landing-page')
    }, function (error) {
    });
  };
}])

.controller('dashboardCtrl', ['$scope','Job', function($scope,Job){
	$scope.getJobs = function(){
		Job.get({mine:true},'name url_name').then(function(data){
			$scope.jobs = data;
		})
	}
	$scope.getJobs();
	$scope.newJob = function(){
		$scope.making_job = !$scope.making_job
	}
	$scope.saveJob = function(){
		$scope.making_job = !$scope.making_job;
		Job.create({
			name: $scope.new_job_name
		}).then(function(data){
			$scope.jobs.push(data);
		})
	}
}])

.controller('campaignCtrl', ['$scope','$state','$stateParams','Job',function($scope,$state,$stateParams,Job){
	$scope.getJob = function(){
		var job_name = $stateParams.job_name;
		Job.show({url_name: job_name}).then(function(data){
			$scope.job = data;
		})
	}
	$scope.getJob();
	$scope.editDescription = function(){
		$scope.editing_description = !$scope.editing_description;
	}
	$scope.saveDescription = function(){
		$scope.editing_description = !$scope.editing_description;
		Job.update({description: $scope.job.description},$scope.job._id).then(function(data){
		})
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
		Job.update({timer: $scope.job.timer},$scope.job._id).then(function(data){
		})
	}
	$scope.addQuestion = function(){
		$scope.adding_question = !$scope.adding_question;
	}
	$scope.saveQuestion = function(){
		$scope.adding_question = !$scope.adding_question;
		$scope.job.questions.push({text: $scope.new_question});
		$scope.new_question = '';
		Job.update({questions:$scope.job.questions},$scope.job._id).then(function(data){
		})
	}
	$scope.deleteQuestion = function(index){
		$scope.job.questions.splice(index,1);
		Job.update({questions:$scope.job.questions},$scope.job._id).then(function(data){
		})
	}
}])

.controller('applicantCtrl', ['$scope', function($scope){

}])

.controller('detailsCtrl', ['$scope','$state','$stateParams','Job','Applicant',function($scope,$state,$stateParams,Job,Applicant){
	$scope.user = {};
	$scope.job_name = $stateParams.job_name;
	$scope.getJob = function(){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job_id = data._id;
			console.log("yay");
		}, function(error){
			$state.go('error.description',{error_id: 1});
		});
	}
	$scope.getJob();
	$scope.saveDetails = function(){
		Applicant.create({
			name: $scope.user.name,
			email: $scope.user.email,
			phone: $scope.user.phone,
			job: $scope.job_id
		}).then(function(data){
			$state.go('interview.take',{job_name: $scope.job_name, applicant_id: data._id})
		})
	}
}])

.controller('takeCtrl', ['$scope','$state','$stateParams','$interval','Job','Applicant',function($scope,$state,$stateParams,$interval,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.answering_question = false;
	var countdown;
	$scope.getJob = function(){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			$scope.timer = 60*data.timer;
		});
	}
	$scope.getJob();
	$scope.startInterview = function(){
		$scope.interview_started = !$scope.interview_started;
		countdown = $interval(function(){
			$scope.timer--;
			if($scope.timer <= 0)
				$scope.endInterview()
		},1000);
	}
	$scope.answerQuestion = function(question){
		if($scope.answering_question) return;
		$scope.answering_question = true;
		question.answering = !question.answering;
		Applicant.answer({
			applicant: $scope.applicant_id,
			question: question.text
		}).then(function(data){
			console.log(data);
		});
	}
	$scope.endQuestion = function(question){
		$scope.answering_question = false;
		question.answered = true;
	}
	$scope.endInterview = function(){
		if (angular.isDefined(countdown)) {
			$interval.cancel(countdown);
			countdown = undefined;
		}
		$state.go('interview.end',{job_name: $scope.job_name})
	}
	$scope.timeDisplay = function(){
		var minutes = parseInt($scope.timer/60).toString();
		var seconds = ($scope.timer%60).toString();
		if(seconds.length < 2) seconds = "0"+seconds;
		return minutes+":"+seconds;
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
}]);