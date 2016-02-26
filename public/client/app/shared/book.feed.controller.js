angular.module('booklist.feed', [])

.controller('FeedController', ['$scope', 'Books', function($scope, Books){
  $scope.data = {};

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.getBooks = function(){
    Books.getBooks()
    //TODO - check to make sure the resp format is correct after you connect to the server
    .then(function(resp){
      console.log(resp);
      $scope.data.books = resp;
    })
    .catch(function(error){
      console.log(error);
      return;
    });
  };

  $scope.addToReadList = function (bookTitle, bookISBN, publisher, highResImage, largeImage, mediumImage, smallResImage, thumbNail, amzURL, authorName) {
    Books.postBook({
      title: bookTitle,
      ISBN: bookISBN,
      publisher: publisher,
      high_res_image: highResImage,
      large_image: largeImage,
      medium_image: mediumImage,
      small_image: smallResImage,
      thumbnail_image: thumbNail,
      amz_url: amzURL
    }, authorName, 0);
  };

  //TODO - see if there is a better way to preload the books
  $scope.getBooks();
}]);
