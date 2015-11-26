/**
* app.directives Module
*
* Description
*/
angular.module('app.directives', [])

.directive('audioPlayer',function($interval) {
    return {
        restrict:'E',
        scope: {
            source: '='
        },
        templateUrl: 'partials/audioPlayer',
        link: function($scope, element, attrs){
        	// console.log($scope);
        	$scope.$watch('ctime', function(value){
        		if($scope.ctime == $scope.duration) $scope.playing = false;
        	})
        },
        controller: function($scope){
            if(typeof $scope.source == "string"){
              console.log("init audio");
              $scope.audio = new Audio();
              $scope.audio.src = $scope.source;
              $scope.vol = 0.6;
              $scope.audio.volume = 0.6;
            }
            $scope.playing = false;
            $scope.play = function(){
                $scope.audio.play();
                $scope.playing = true;
            };
            $scope.pause = function(){
                $scope.audio.pause();
                $scope.playing = false;
            };
            $interval(function(){
                $scope.ctime = $scope.audio.currentTime.toFixed(1);
            },100);
            $scope.$watch('audio.duration', function(newval){
                $scope.duration = $scope.audio.duration.toFixed(1);
            });
            $scope.changetime = function(t){
                $scope.audio.currentTime = $scope.ctime;
            };
            $scope.changevol = function(t){
                $scope.audio.volume = $scope.vol;
            };
            $scope.ntot = function(secs) {
				var hr  = Math.floor(secs / 3600);
				var min = Math.floor((secs - (hr * 3600))/60);
				var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
				if (min < 10){ 
				min = "0" + min; 
				}
				if (sec < 10){ 
				sec  = "0" + sec;
				}
				return min + ':' + sec;
            }
        }
    };
});