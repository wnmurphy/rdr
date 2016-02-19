angular.module('booklist.user', [])

.controller('UserController', ['$scope', function($scope, Books){
  $scope.user = {};

  $scope.addBook = function(){
    //TODO: check how to do error handling
    Books.postBook($scope.bookName, $scope.authorName, $scope.userID, $scope.reaction);
  };
  $scope.getBooks = function(){
    //TODO: specify only books for the particular user
    Books.getBooks()
    .then(function(resp){
      $scope.data.books = resp;
    })
    .catch(function(error){
      console.log(error);
      return;
    });
  };
}]);