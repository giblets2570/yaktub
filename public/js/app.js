// /**
// * app Module
// *
// * Description
// */
angular.module('app', ['ngAnimate','ui.router','app.controllers','app.directives'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider) {
    //================================================
    // Check if the user is authenticated
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $state, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      $http({
        method:'GET',
        url:'/auth/loggedin',
        cache: false
      }).success(function(user){
        // Authenticated
        if (user !== '0'){
          /*$timeout(deferred.resolve, 0);*/
          $rootScope.user = {
            name: user.name,
            _id: user._id
          }
          deferred.resolve();
        // Not Authenticated
        }else {
          $timeout(function(){
            deferred.reject();
          }, 0);
          deferred.reject();
          $state.go('landing-page');
        }
      });
      return deferred.promise;
    };

    var isLoggedin = function($q, $timeout, $http, $state, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      $http({
        method:'GET',
        url:'/auth/loggedin',
        cache: false
      }).success(function(user){
        // Authenticated
        if (user !== '0'){
          /*$timeout(deferred.resolve, 0);*/
          $rootScope.user = {
            name: user.name,
            _id: user._id
          }
          deferred.reject();
          $state.go('home.dashboard');
        // Not Authenticated
        }else {
          $timeout(function(){
            deferred.reject();
          }, 0);
          deferred.resolve();
        }
      });
      return deferred.promise;
    };

    //================================================
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/');
          return $q.reject(response);
        }
      };
    });

    $urlRouterProvider.otherwise('/home/dashboard');
    $locationProvider.html5Mode(true);
    $stateProvider

      // HOME STATES AND NESTED VIEWS ========================================
      .state('landing-page', {
        url: '/',
        templateUrl: 'partials/landing-page',
        controller: 'loginCtrl',
        resolve: {
          isLoggedIn: isLoggedin
        }
      })

      .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'partials/home',
        controller: 'homeCtrl',
        resolve: {
          isLoggedIn: checkLoggedin
        }
      })

      .state('home.dashboard', {
        url: '/profile',
        templateUrl: '/partials/dashboard',
        controller: 'dashboardCtrl'
      })

      .state('home.job', {
      	url: '/:job_name',
      	templateUrl: '/partials/job',
        controller: 'jobCtrl'
      })

      .state('home.settings', {
        url: '/settings',
        templateUrl: '/partials/settings',
        controller: 'settingsCtrl'
      })

      .state('home.applicants', {
      	url: '/:job_name/applicants',
      	templateUrl: '/partials/applicants',
        controller: 'applicantsCtrl'
      })

      .state('interview', {
        url: '/interview',
        abstract: true,
        templateUrl: 'partials/interview',
      })

      .state('interview.details', {
        url: '/:job_name',
        templateUrl: 'partials/details',
        controller: 'detailsCtrl'
      })

      .state('interview.end', {
        url: '/:job_name/end',
        templateUrl: 'partials/end'
      })

      .state('interview.take', {
        url: '/:job_name/:applicant_id',
        templateUrl: 'partials/take',
        controller: 'takeCtrl'
      })

      .state('error', {
        url: '/error',
        abstract: true,
        templateUrl: 'partials/error'
      })

      .state('error.description', {
        url: '/:error_id',
        templateUrl: 'partials/error_type',
        controller: 'errorCtrl'
      });

});