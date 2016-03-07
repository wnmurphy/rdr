angular.module('booklist.search', [])

.controller('UserFeedController', ['$scope', 'Books','$rootScope', '$timeout', '$location', 'auth', function($scope, Books, $rootScope, $timeout, $location, auth){
  $scope.user = {};
  $scope.books = [];
  
  // search bar model
  $scope.search = {
    field: null
  };
  // $scope.path = $location.path();

  $scope.auth = auth;
  $scope.firstName = $scope.auth.profile.nickname;

  // Loading spinner is hidden when false
  $scope.submitting = false;

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.scrollToTop = function (e) {
    $target = $(e.target);
    if ($target.hasClass('active')) {
      $('.book-collection:not([display="none"])').animate({
        scrollTop: 0
      }, '500', 'swing');
    }
  };

  $scope.userQuery = function(e) {
    var email = $scope.search.field;
    $scope.search.field = null;
    Books.getUserProfile(email)
      .then(function(data) {
        data.books.forEach(function (book) {
          data.authors.forEach(function (author) {
            if (author.id === book.author_id) {
              book.author.name = author.name;
            }
          });
        });
        $scope.books = data.books;
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
}]);
