angular.module('booklist.user', [])

.controller('UserController', ['$scope', '$rootScope', function($scope, Books, $rootScope){
  $scope.user = {};
  // $scope.books = $rootScope.books
  $scope.addBook = function(){
    //TODO: check how to do error handling
    Books.postBook($scope.bookName, $scope.authorName, $scope.reaction);
    //TODO: add the new book to the user's page
  };
  //get books on signin
}]);