angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'booklist.user',
  'booklist.auth',
  'auth0', 
  'angular-storage', 
  'angular-jwt',
  'ngRoute'
])
.config(['$routeProvider', 'authProvider',function($routeProvider, authProvider) {
  console.log('routing');
  $routeProvider
    .when('/', {
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
    .when('/profile', {
      templateUrl: '/app/shared/user.page.html',
      controller: 'UserController'
      // requiresLogin: true TODO
    })
    .otherwise({
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    });

    authProvider.init({
      domain: 'thebooklist.auth0.com',
      clientID: 'KVmjN4H2bQUdJspERpFnHhSRl8cA12b6',
      //TODO: check that this is the correct callback url
      // callbackURL: '/profile',
      // loginUrl: '/login'
    });
}])
  .run(function($rootScope, auth, $location, jwtHelper){
    auth.hookEvents();
  });