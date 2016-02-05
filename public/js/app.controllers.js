/**
* appControllers Module
*
* Description
*/
angular.module('app.controllers', ['app.services','angular-clipboard','angularAudioRecorder'])

.controller('loginCtrl', ['$scope','$state','Client','Alert',function($scope,$state,Client,Alert){
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
	    	Alert.warning('Login credentials wrong!').then(function(alert){
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
	    	Alert.warning('Login credentials wrong!').then(function(alert){
	    		alert.show();
	    	});
	    	$scope.user_signup = {
				username: {}
			};
	    });
		})
	};
}])

.controller('homeCtrl', ['$scope','$state','Client','Applicant',function($scope,$state,Client,Applicant){
	var pusher = new Pusher('9d60e889329cae081239', {
      encrypted: true
    });
    var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function(data) {
      alert(data.message);
    });

	$scope.logout = function(){
	    Client.logout().then(function(data){
	    	$state.go('landing-page')
	    }, function (error) {
	    });
	};
	$scope.convertMP3 = true;
	$scope.conversionDone = function(blob){
		console.log('This is the blob yooooo');
		console.log(blob.audioModel);
		var file = new File([blob.audioModel], "filename.mp3");
		console.log(file);
		Applicant.sendFile(file).then(function(data){
			var filename = data.config.data.file.name;
			var uploaded_filename = data.config.url + data.config.data.key;
			console.log(uploaded_filename);
		})
	}
}])

.controller('dashboardCtrl',['$scope','$state','Job','Alert',function($scope,$state,Job,Alert){
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
		Alert.success("Adding new job...").then(function(loading){
			loading.show();
			Job.create({
				name: $scope.new_job_name
			}).then(function(data){
				$scope.jobs.push(data);
				loading.hide();
				$state.go('home.job',{job_name: data.url_name});
			});
		});
	}
}])

.controller('jobCtrl', ['$scope','$state','$stateParams','$location','$timeout','Job','Alert',function($scope,$state,$stateParams,$location,$timeout,Job,Alert){
	$scope.getShareableUrl = function(){
		var result = "https://" + $location.host();
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

.controller('applicantsCtrl', ['$scope','$state','$stateParams','Job','Applicant', function($scope,$state,$stateParams,Job,Applicant){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.show_filtered = true;
	$scope.getJob = function(c){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			(c || angular.noop)();
		});
	}
	$scope.getApplicants = function(){
		if($scope.applicant_id){
			Applicant.show({},'',$scope.applicant_id).then(function(data){
				$scope.applicants = [data];
				console.log(data);
			})
		}else{
			Applicant.get({job: $scope.job._id}).then(function(data){
				$scope.applicants = data;
				console.log(data);
			})
		}
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

.controller('takeCtrl', ['$scope','$state','$stateParams','$interval','Job','Applicant','Alert',function($scope,$state,$stateParams,$interval,Job,Applicant,Alert){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.current_question = -1;
	$scope.files = [];
	$scope.checkIfStartedPreviously = function(){
		Applicant.show({},'answers started',$scope.applicant_id).then(function(data){
			if(data.started)
				$state.go('error.description',{error_id: 2})
			$scope.getJob();
		})
	}
	$scope.checkIfStartedPreviously();
	$scope.questions_answered = 0;
	var countdown;
	$scope.getJob = function(){
		Job.show({url_name: $scope.job_name}).then(function(data){
			$scope.job = data;
			$scope.answers = [];
			for (var i = 0; i < $scope.job.questions.length; i++) {
				$scope.answers.push({
					question: $scope.job.questions[i].text
				})
			};
			$scope.timer = 60*data.timer;
			$scope.number_questions = $scope.job.questions.length;
		});
	}
	$scope.startInterview = function(){
		$scope.interview_started = !$scope.interview_started;
		Applicant.update({
			started: true
		},$scope.applicant_id).then(function(data){
			countdown = $interval(function(){
				$scope.timer--;
				if($scope.timer <= 0)
					$scope.endInterview()
			},1000);
		});
	}
	$scope.answerQuestion = function(question,index){
		$scope.current_question = index;
		question.answering = !question.answering;
	}
	$scope.endQuestion = function(question){
		question.answered = true;
		$scope.current_question = -1;
		if($scope.questions_answered+1==$scope.number_questions){
			if (angular.isDefined(countdown)) {
				$interval.cancel(countdown);
				countdown = undefined;
			}
		}
	}
	$scope.endInterview = function(){
		if (angular.isDefined(countdown)) {
			$interval.cancel(countdown);
			countdown = undefined;
		}
		Job.finish($scope.job._id, $scope.applicant_id).then(function(data){
			$state.go('interview.end',{job_name: $scope.job_name});
		})
	}
	$scope.timeDisplay = function(){
		var minutes = parseInt($scope.timer/60).toString();
		var seconds = ($scope.timer%60).toString();
		if(seconds.length < 2) seconds = "0"+seconds;
		return minutes+":"+seconds;
	}
	$scope.uploadAnswers = function(){
		if($scope.files.length==0) return;
		var fileObj = $scope.files.pop();
		console.log(fileObj);
		Alert.success("Uploading answer","Please don't leave this page").then(function(loading){
			loading.show();
			Applicant.sendFile(fileObj.file).then(function(data){
				var filename = data.config.data.file.name;
				var uploaded_filename = data.config.url + data.config.data.key;
				console.log($scope.answers);
				console.log($scope.answers.length);
				$scope.answers[fileObj.answer].recording_url=uploaded_filename;
				Applicant.update({
					answers: $scope.answers
				}, $scope.applicant_id).then(function(data){
					loading.hide();
					Alert.success("Answer saved").then(function(done){
						done.show();
						$scope.questions_answered += 1;
						// console.log($scope.questions_answered,$scope.number_questions);
						if($scope.questions_answered == $scope.number_questions)
							$scope.endInterview();
					})
				})
			})
		})
	}
	$scope.convertMP3 = true;
	$scope.conversionDone = function(blob,index){
		var file = new File([blob.audioModel], "filename.mp3");
		console.log(file);
		$scope.files.push({
			file: file,
			answer: index
		})
	}
	var checker = $interval(function(){
		$scope.uploadAnswers();
	},1000);
	$scope.currentQuestion = function(index){
		return $scope.current_question == -1 || $scope.current_question == index ? true : false
	}
}])

.controller('settingsCtrl', ['$scope','Client', function($scope,Client){
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

.controller('errorCtrl', ['$scope','$state','$stateParams',function($scope,$state,$stateParams){
	$scope.error_id = $stateParams.error_id;
	$scope.error_messages = {
		1: 'This job does not exist!',
		2: 'You have already started this interview on a previous date!'
	}
}]);