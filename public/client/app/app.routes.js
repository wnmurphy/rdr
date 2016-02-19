angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'booklist.user',
  'ngRoute'
])
.config(['$routeProvider',function($routeProvider) {
  console.log('routing');
  $routeProvider
    .when('/', {
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
    .when('/profile', {
      templateUrl: '/app/shared/user.page.html',
      controller: 'UserController'
    })
    .otherwise({
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
}])