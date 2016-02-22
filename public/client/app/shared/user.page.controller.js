angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', function($scope, Books, $rootScope){
  $scope.user = {};
  // $scope.books = $rootScope.books

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.bookTitle = '';
  $scope.authorName = ''
  $scope.reaction = 0;

  $scope.setReaction = function ($event, reaction) {
    var $target = $($event.currentTarget);
    $('.reactions').find('.selected').removeClass('selected');
    $target.addClass('selected');
  };

  $scope.addBook = function(){

    console.log($scope.reaction);
    //TODO: check how to do error handling
    Books.postBook($scope.bookTitle, $scope.authorName, $scope.reaction)
    .then(function(resp){
    })
    .catch(function(error){
      console.log(error);
      return;
    });
    //TODO: add the new book to the user's page
  };
  //get books on signin
}]);