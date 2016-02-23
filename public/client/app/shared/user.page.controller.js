angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', function($scope, Books, $rootScope){
  $scope.user = {};
  $scope.books = [];

  $scope.submitting = false;

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.bookTitle = '';
  $scope.authorName = '';
  $scope.publicationYear;
  $scope.amazonUrl = '';
  $scope.publisher = '';
  $scope.reaction = 0;

  $scope.amazonResults = [];

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

  $scope.initialize = function () {
    Books.getBooks()
    .then(function (resp) {
      if (resp.data) {
        $scope.books = $scope.books.concat(resp.data);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.checkAmazon = function () {
    $scope.bookTitle = $scope.bookTitle || '';
    $scope.authorName = $scope.authorName || '';
    var title = $scope.bookTitle.trim();
    var authorName = $scope.authorName.trim();
    if (title.length || authorName.length) {
      $scope.submitting = true;
      Books.queryAmazon({title: title, authorName: authorName})
      .then(function (results) {
        if (results.data[0] && !results.data[0].Error) {
          $scope.amazonResults = results.data;
        } else {
          $scope.amazonResults = [];
        }
        $scope.submitting = false;
        
      })
      .catch(function (error) {
        $scope.submitting = false;
      });
    } else {
      console.log('fail');
    }
  };

  $scope.selectAmazonResult = function (result) {
    $scope.bookTitle = result.ItemAttributes[0].Title[0];
    $scope.authorName = result.ItemAttributes[0].Author[0];
    $scope.publicationYear = result.ItemAttributes[0].PublicationDate[0].split('-')[0];
    $scope.publisher = result.ItemAttributes[0].Publisher[0];
    $scope.amazonUrl = result.DetailPageURL[0];

    $scope.amazonResults = [];

    $('label[for="author"').addClass('active');
    $('label[for="title"').addClass('active');
  };

  $scope.addBook = function() {
    //TODO: check how to do error handling
    Books.postBook($scope.bookTitle, $scope.authorName, $scope.reaction)
    .then(function(resp){
      if (resp.book && resp.author) {
        var book = resp.book;
        book.authorName = resp.author.name;
        $scope.books.push(book);
        $scope.clearBookInfo();
      }
    })
    .catch(function(error){
      console.error(error);
      return;
    });
    //TODO: add the new book to the user's page
  };

  $scope.clearBookInfo = function () {
    $scope.bookTitle = '';
    $scope.authorName = '';
    $scope.publicationYear = '';
    $scope.amazonUrl = '';
    $scope.publisher = '';
    $scope.reaction = 0;
    $('.reactions').find('.selected').removeClass('selected');
  };

  $scope.initialize();

  //get books on signin
}]);