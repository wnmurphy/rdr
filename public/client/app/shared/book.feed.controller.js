angular.module('booklist.feed', [])

.controller('FeedController', ['$scope', function($scope, Books){
  $scope.data = {};
  $scope.data.books = [{'title': 'Prince Rainbow 1', 'authorName': 'Appleman1' }, {'title': 'LampLoving', 'authorName': 'Brett'}, {'title': 'Zoolander', 'authorName': 'Derek Zoolander'}];
  $scope.getBooks = function(){
    Books.getBooks()
    //TODO - check to make sure the resp format is correct after you connect to the server
    .then(function(resp){
      $scope.data.books = resp;
    })
    .catch(function(error){
      console.log(error);
      return;
    });
  };
  //TODO - see if there is a better way to preload the books
  // $scope.getBooks();
}]);