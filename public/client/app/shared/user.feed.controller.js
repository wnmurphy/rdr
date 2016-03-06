angular.module('booklist.search', [])

.controller('UserFeedController', ['$scope', 'Books','$rootScope', '$timeout', '$location', 'auth', function($scope, Books, $rootScope, $timeout, $location, auth){
  $scope.user = {};
  $scope.books = [];
  $scope.path = $location.path();

  $scope.auth = auth;
  // $scope.firstName = $scope.auth.profile.name.split(' ')[0];
  $scope.firstName = $scope.auth.profile.nickname;
  // $scope.firstName = $scope.auth.profile;

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
    var username = e.target.value;
    e.target.value = '';
    Books.getUserProfile(username)
      .then(function(results) {
        $scope.books = results.data;
        // calibrates slider??
        $scope.books.forEach(function(book) {
          book.reactionSlider = (book.reaction - 1) * 25;
        });
      })
      .catch(function(err) {
        console.error('Error getting user profile:', err);
      });
  };

  // Used for filtering front page of profile to not show books in to-read list
  $scope.filterReactions = function (element) {
    return element.reaction > 0;
  };

  // $scope.initialize();
}]);
