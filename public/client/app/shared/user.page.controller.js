angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', '$timeout', '$location', function($scope, Books, $rootScope, $timeout, $location){
  $scope.user = {};
  $scope.books = [];
  $scope.path = $location.path();

  $scope.submitting = false;

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.bookTitle = '';
  $scope.authorName = '';
  $scope.publicationYear;
  $scope.amz_url = '';
  $scope.publisher = '';
  $scope.ISBN = '';
  $scope.reaction = -1;
  $scope.high_res_image = '';
  $scope.medium_image = '';
  $scope.small_image = '';
  $scope.thumbnail_image = '';

  $scope.amazonResults = [];

  $scope.hasRead = false;

  $scope.addToReadingList = function () {
    $scope.hasRead = false;
    $scope.reaction = 0;
  }

  $scope.setReaction = function ($event, reaction) {
    var $target = $($event.currentTarget);
    $('.reaction-buttons').find('.selected').removeClass('selected');
    if ($scope.reaction === reaction) {
      $scope.reaction = undefined;
    } else {
      $target.addClass('selected');
      $scope.reaction = reaction;
    }
  };

  $scope.scrollToTop = function (e) {
    $target = $(e.target);
    if ($target.hasClass('active')) {
      $('.book-collection:not([display="none"])').animate({
        scrollTop: 0
      }, '500', 'swing');
    }
  };

  $scope.updateReaction = function (book) {
    book.reaction = book.reactionSlider/25 + 1;
    Books.postBook({
      title: book.title,
      ISBN: book.ISBN,
      publisher: book.publisher,
      high_res_image: book.high_res_image,
      large_image: book.large_image,
      medium_image: book.medium_image,
      small_image: book.small_image,
      thumbnail_image: book.thumbnail_image
    }, book.author.name, book.reaction);
  };

  $scope.initialize = function () {
    $scope.resetProfile();
    $('.add-book').on('click', function (e) {
      var $target = $(e.target);
      if (!$target.hasClass('active')) {
        setTimeout(function () {
          $('#title').focus();
        }, 250);
      }
    });
  };

  $scope.resetProfile = function () {
    Books.getProfile()
    .then(function (resp) {
      if (resp.books) {
        $scope.books = resp.books;
        $scope.books.forEach(function (book) {
          book.reactionSlider = (book.reaction - 1) * 25;
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  $scope.checkAmazon = function () {
    $scope.bookTitle = $scope.bookTitle || '';
    $scope.authorName = $scope.authorName || '';
    var title = $scope.bookTitle.trim();
    var authorName = $scope.authorName.trim();
    if (title.length || authorName.length) {
      $scope.submitting = true;
      Books.queryAmazon({title: title, authorName: authorName})
      .then(function (results) {
        console.log(results);
        if (results.data[0] && !results.data[0].Error) {
          $scope.amazonResults = results.data;
        } else {
          $scope.amazonResults = [];
        }
        $('.amazon-results').scrollTop(0);
        $scope.submitting = false;

      })
      .catch(function (error) {
        $scope.submitting = false;
      });
    } else {
      console.log('fail');
    }
  };

  var timer;
  //this function sets a timer on ngKeyup
  $scope.searchTimer = function () {
    $timeout.cancel(timer);
    timer = $timeout($scope.checkAmazon, 400);
  }

  $scope.selectAmazonResult = function (result) {
    if (result.ItemAttributes[0].Title) {
      $scope.bookTitle = result.ItemAttributes[0].Title[0];
    }
    if (result.ItemAttributes[0].Author) {
      $scope.authorName = result.ItemAttributes[0].Author[0];
    }
    if (result.ItemAttributes[0].PublicationDate) {
      $scope.publicationYear = result.ItemAttributes[0].PublicationDate[0].split('-')[0];
    }
    if (result.ItemAttributes[0].Publisher) {
      $scope.publisher = result.ItemAttributes[0].Publisher[0];
    }
    if (result.DetailPageURL) {
      // convert url to affiliate id taged link
      $scope.amz_url = result.DetailPageURL[0].split('%')[0] + "?camp=1789&creative=9325&linkCode=ur2&tag=rdr0a-20";
    }
    if (result.ItemAttributes[0].ISBN) {
      $scope.ISBN = result.ItemAttributes[0].ISBN[0];
    }

    var imageSet = result.ImageSets[0].ImageSet[0];
    for (var i = 0; i < result.ImageSets[0].ImageSet.length; i++) {
      var checkSet = result.ImageSets[0].ImageSet[i];
      if (checkSet.$.Category === 'primary') {
        imageSet = checkSet;
        break;
      }
    }
    if (imageSet) {
      if (imageSet.HiResImage) {
        $scope.high_res_image = imageSet.HiResImage[0].URL[0];
      }
      if (imageSet.LargeImage) {
        $scope.large_image = imageSet.LargeImage[0].URL[0];
      }
      if (imageSet.MediumImage) {
        $scope.medium_image = imageSet.MediumImage[0].URL[0];

      }
      if (imageSet.SmallImage) {
        $scope.small_image = imageSet.SmallImage[0].URL[0];

      }
      if (imageSet.ThumbnailImage) {
        $scope.thumbnail_image = imageSet.ThumbnailImage[0].URL[0];
      }
    }


    $scope.amazonResults = [];

    $('label[for="author"').addClass('active');
    $('label[for="title"').addClass('active');
    $('body').animate({
      scrollTop: $('.greet').offset().top
    }).duration(1750);
  };

  $scope.addBook = function() {
    Books.postBook({
      title: $scope.bookTitle,
      ISBN: $scope.ISBN,
      publisher: $scope.publisher,
      high_res_image: $scope.high_res_image,
      large_image: $scope.large_image,
      medium_image: $scope.medium_image,
      small_image: $scope.small_image,
      thumbnail_image: $scope.thumbnail_image,
      amz_url: $scope.amz_url
    }, $scope.authorName, $scope.reaction)
    .then(function(resp){
      if (resp.book && resp.author) {
        var book = resp.book;
        book.author = {};
        book.ISBN = $scope.ISBN;
        book.author.name = resp.author.name;
        book.reaction = $scope.reaction;
        book.reactionSlider = (book.reaction - 1) * 25;
        book.high_res_image = $scope.high_res_image;
        book.large_image = $scope.large_image;
        book.medium_image = $scope.medium_image;
        book.small_image = $scope.small_image;
        book.thumbnail_image = $scope.thumbnail_image;
        book.amz_rul = $scope.amz_url;
        $scope.clearBookInfo();
        $scope.resetProfile();
        Materialize.toast('Book added!', 1750);
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
    $scope.amz_url = '';
    $scope.publisher = '';
    $scope.reaction = 0;
    $scope.high_res_image = '';
    $scope.ISBN = '';
    $scope.large_image = '';
    $scope.medium_image = '';
    $scope.small_image = '';
    $scope.thumbnail_image = '';
    $('.reactions').find('.selected').removeClass('selected');
  };

  $scope.filterReactions = function (element) {
    return element.reaction > 0;
  }

  $scope.initialize();

  //get books on signin
}]);
