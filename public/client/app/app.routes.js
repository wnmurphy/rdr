angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'ngRoute'
])
.config(['$routeProvider',function($routeProvider) {
  $routeProvider
    .when('/', {
      templateURL: '/shared/book.feed.html',
      controller: 'FeedController'
    })
}])