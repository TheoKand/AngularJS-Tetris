var app = angular.module('myApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
          templateUrl: 'views/home.html',
          controller: 'homeController'
      })
      .when('/highscores', {
          templateUrl: 'views/highscores.html',
          controller: 'highscoresController'
      })
      .otherwise({
          redirectTo: '/'
      });
}])
.controller('mainController', function ($scope) {
    $scope.message = "Main Content";
});;