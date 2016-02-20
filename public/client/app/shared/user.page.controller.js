angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', function($scope, Books, $rootScope){
  $scope.user = {};
  // $scope.books = $rootScope.books

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.addBook = function(){

    //TODO: check how to do error handling
    Books.postBook($scope.bookName, $scope.authorName, $scope.reaction)
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