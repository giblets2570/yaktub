app.controller('homeCtrl', ['$scope','$state','Client','Applicant',function($scope,$state,Client,Applicant){
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