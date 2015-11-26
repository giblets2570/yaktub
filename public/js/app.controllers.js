/**
* appControllers Module
*
* Description
*/
angular.module('app.controllers', ['app.services','angular-clipboard'])

.controller('loginCtrl', ['$scope','$rootScope','$state','Client',function($scope,$rootScope,$state,Client){
	$scope.user = {
		username: 'Tom Keohane Murray',
		password: 'bogaboga'
	};
  	$scope.login = function(){
	    Client.login($scope.user).then(function(data){
	    	$rootScope.client = data._id;
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

.controller('jobCtrl', ['$scope','$state','$stateParams','$location','Job',function($scope,$state,$stateParams,$location,Job){
	$scope.getShareableUrl = function(){
		var result = $location.protocol() + "://" + $location.host();
		if($location.port())
			result+=":"+$location.port();
		result += '/interview/'+$scope.job.url_name;
		$scope.shareableUrl = result;
	}
	$scope.getJob = function(){
		var job_name = $stateParams.job_name;
		Job.show({url_name: job_name}).then(function(data){
			$scope.job = data;
			$scope.getShareableUrl();
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
		if($scope.job.timer < 1) $scope.job.timer = 1;
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
	$scope.success = function () {
        console.log('Copied!');
    };

    $scope.fail = function (err) {
        console.error('Error!', err);
    };
}])

.controller('applicantsCtrl', ['$scope','$state','$stateParams','Job','Applicant', function($scope,$state,$stateParams,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.show_filtered = true;
	$scope.getJob = function(c){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			(c || angular.noop)();
		});
	}
	$scope.getApplicants = function(){
		Applicant.get({job: $scope.job._id}).then(function(data){
			$scope.applicants = data;
			console.log(data);
		})
	}
	$scope.getJob($scope.getApplicants);
	$scope.editNotes = function(applicant){
		applicant.editing_notes = !applicant.editing_notes;
	}
	$scope.saveNotes = function(applicant){
		applicant.editing_notes = !applicant.editing_notes;
		Applicant.update({notes: applicant.notes},applicant._id).then(function(data){
			console.log(data);
		});
	}
	$scope.followedUp = function(applicant){
		Applicant.update({followed_up: applicant.followed_up},applicant._id).then(function(data){
			console.log(data);
		});
	}
	$scope.isFollowed = function(applicant){
		return applicant.followed_up ? 'followed-up' : '';
	}
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

.filter('applicantsFilter', function(){
	return function(applicants, show_filtered){
		if(show_filtered) return applicants;
		var result = [];
		for (var i = 0; i < applicants.length; i++) {
			if(!applicants[i].followed_up)
				result.push(applicants[i])
		};
		return result;
	}
})

.controller('takeCtrl', ['$scope','$state','$stateParams','$interval','Job','Applicant',function($scope,$state,$stateParams,$interval,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.answering_question = false;
	$scope.questions_answered = 0;
	var countdown;
	$scope.getJob = function(){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			$scope.timer = 60*data.timer;
			$scope.number_questions = $scope.job.questions.length;
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
		Twilio.Device.connect({
			applicant: $scope.applicant_id,
			question: question.text
		});
	}
	$scope.endQuestion = function(question){
		$scope.answering_question = false;
		question.answered = true;
		Twilio.Device.disconnectAll();
		$scope.questions_answered += 1;
		if($scope.questions_answered == $scope.number_questions)
			$scope.endInterview();
	}
	$scope.endInterview = function(){
		if (angular.isDefined(countdown)) {
			$interval.cancel(countdown);
			countdown = undefined;
		}
		Twilio.Device.disconnectAll();
		$state.go('interview.end',{job_name: $scope.job_name})
	}
	$scope.timeDisplay = function(){
		var minutes = parseInt($scope.timer/60).toString();
		var seconds = ($scope.timer%60).toString();
		if(seconds.length < 2) seconds = "0"+seconds;
		return minutes+":"+seconds;
	}
	$scope.twilioSetup = function(){
		Applicant.twilio($scope.applicant_id).then(function(data){
			Twilio.Device.setup(data);
		})
	}
	$scope.twilioSetup();
	//Twilio javascript
    Twilio.Device.ready(function (device) {
        // console.log(device);
        // $scope.call_button_text = 'Call';
        // $scope.$apply();
    });

    Twilio.Device.error(function (error) {
    	// console.log(error);
    	// $scope.call_button_text = 'Session expired, refresh page';
     //    $scope.$apply();
    });

    Twilio.Device.connect(function (conn) {
    	// console.log(conn);
    });

    Twilio.Device.disconnect(function (conn) {
        // console.log(conn);
    });
}]);