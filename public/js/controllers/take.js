app.controller('takeCtrl', ['$scope','$state','$stateParams','$interval','Job','Applicant','Alert',function($scope,$state,$stateParams,$interval,Job,Applicant,Alert){
	$scope.job_name = $stateParams.job_name;
	$scope.applicant_id = $stateParams.applicant_id;
	$scope.current_question = -1;
	$scope.files = [];
	$scope.loading_alerts = [];
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
			Alert.warning("Uploading your answer","Please don't leave this page until this popup disappears",null,"floater-middle-page").then(function(loading){
				loading.show();
				$scope.loading_alerts.push(loading);
			})
		}else{
			Alert.success("Uploading answer","Please don't leave this page",null).then(function(loading){
				loading.show();
				$scope.loading_alerts.push(loading);
			})
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
		var loading = $scope.loading_alerts.shift();
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
				Alert.success("Answer saved","",3).then(function(done){
					done.show();
					$scope.questions_answered += 1;
					// console.log($scope.questions_answered,$scope.number_questions);
					if($scope.questions_answered == $scope.number_questions)
						$scope.endInterview();
				})
			})
		})
	}
	$scope.convertMP3 = true;
	$scope.conversionDone = function(blob,index){
		var file = new File([blob.audioModel], "filename.mp3");
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