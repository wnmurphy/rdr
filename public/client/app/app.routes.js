angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'ngRoute'
])
.config(['$routeProvider',function($routeProvider) {
  console.log('routing');
  $routeProvider
    .when('/', {
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
    .when('',{

    })
    .otherwise({
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
}])