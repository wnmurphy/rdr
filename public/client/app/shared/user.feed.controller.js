angular.module('booklist.search', [])

.controller('UserFeedController', ['$scope', 'Books','$rootScope', '$timeout', '$location', 'auth', function($scope, Books, $rootScope, $timeout, $location, auth){
  $scope.user = {};
  $scope.books = [];
  $scope.path = $location.path();

  $scope.auth = auth;
  $scope.firstName = $scope.auth.profile.name.split(' ')[0];

  // Loading spinner is hidden when false
  $scope.submitting = false;

  $scope.bookTemplate = 'app/shared/book.entry.html';

  // $scope.scrollToTop = function (e) {
  //   console.log('SCROLL EVENT:', e);
  //   $target = $(e.target);
  //   if ($target.hasClass('active')) {
  //     $('.book-collection:not([display="none"])').animate({
  //       scrollTop: 0
  //     }, '500', 'swing');
  //   }
  // };
  
  $scope.userQuery = function(e) {
    console.log('IN TEST:', e);
    var username = e.target.value;
    e.target.value = '';
    // http GET req to server with username
      // on success
        // populate scope.books with user's books
      // on failure
        // notify user 'no such user exists'
  };

  // Used for filtering front page of profile to not show books in to-read list
  $scope.filterReactions = function (element) {
    return element.reaction > 0;
  };

  // $scope.initialize();
}]);
