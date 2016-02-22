angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', function($scope, Books, $rootScope){
  $scope.user = {};
  $scope.books = [];

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.bookTitle = '';
  $scope.authorName = ''
  $scope.reaction = 0;

  $scope.setReaction = function ($event, reaction) {
    var $target = $($event.currentTarget);
    $('.reactions').find('.selected').removeClass('selected');
    if ($scope.reaction === reaction) {
      $scope.reaction = 0;
    } else {
      $target.addClass('selected');
      $scope.reaction = reaction;
    }
  };

  $scope.addBook = function(){


    //TODO: check how to do error handling
    Books.postBook($scope.bookTitle, $scope.authorName, $scope.reaction)
    .then(function(resp){
      if (resp.book && resp.author) {
        var book = resp.book;
        book.authorName = resp.author.name;
        $scope.books.push(book);
      }
    })
    .catch(function(error){
      console.log(error);
      return;
    });
    //TODO: add the new book to the user's page
  };
  //get books on signin
}]);