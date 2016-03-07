angular.module('booklist.services', [])

  .factory('Books', ['$http', '$rootScope', function ($http, $rootScope){
    var getBooks = function(){
     var apiURL = '/books';
     // Seperate API calls when user is signed in vs not signed in.
     // Allows use of user information to return user reactions when signed in.
     if ($rootScope.signedIn) {
       apiURL = '/books/signedin';
     }
     return $http({
       method: 'GET',
       url: apiURL
     })
     .then(function(resp){
       return resp.data;
     }, function(error){
       console.log(error);
       return error;
     });
    };

    var getProfile = function () {
      return $http({
        method: 'GET',
        url: '/profile'
      })
      .then(function (resp) {
        return resp.data;
      })
      .catch(function (error) {
        console.error(error);
        return error;
      });
    };

    var postBook = function (book, authorName, reaction){
      return $http({
        method: 'POST',
        url: '/users/books',
        data: {book: book, author: {name: authorName}, reaction: reaction}
      })
      .then(function(resp) {
        return resp.data;
      }, function(error) {
        console.log(error);
        return error;
      });
    };

    var queryAmazon = function (query) {
      var queryString = '?';
      if (query.title) {
        queryString += '&title=' + query.title;
      }
      if (query.authorName) {
        queryString += '&authorName=' + query.authorName;
      }
      return $http({
        method: 'GET',
        url: '/amazon/' + queryString,
      })
      .then(function (resp) {
        return resp;
      })
      .catch(function (error) {
        return error;
      });
    };

    var getUserProfile = function (email) {
      return $http({
        method: 'GET',
        url: '/user/' + email
      })
      .then(function (resp) {
        return resp.data;
      })
      .catch(function (error) {
        console.error(error);
        return error;
      });
    };

    var updateReaction = function (reaction, bookId) {
      return $http({
        method: 'PUT',
        url:'/books',
        data: {
          reaction: reaction,
          bookId: bookId
        }
      })
      .then(function (resp) {
        return resp.data;
      })
      .catch(function (err) {
        console.error(err);
        return error;
      });
    };

    return {
      updateReaction: updateReaction,
      getBooks: getBooks,
      getProfile: getProfile,
      getUserProfile: getUserProfile,
      postBook: postBook,
      queryAmazon: queryAmazon
    };
  }])
  .run(['$rootScope', function ($rootScope){

    // Stores reaction verbiage for easy changing
    $rootScope.reactions = {
      1: 'Hate it',
      2: 'Dislike it',
      3: 'Decent',
      4: 'Like it',
      5: 'Love it'
    };

    // Stores Math on rootScope to be used in angular HTML atributes
    // ie. Math.round can be used as $scope.round
    $rootScope.Math = window.Math;

    // Takes in a string and returns a code that between 0 and (codes - 1)
    // Only works when codes <= 10
    $rootScope.hash = function (string, codes) {
      var code = string.charCodeAt(Math.floor(string.length/2));
      code = code - Math.floor(code/10) * 10;
      code = code.toString(codes);
      code = parseInt(code.charAt(code.length - 1));
      return code;
    };

    // Stores blankCover image paths (at least 1, no greater than 10)
    $rootScope.blankCovers = ['/assets/img/black_cover_small.jpg', '/assets/img/red_cover_small.jpg'];

  }])
  // Used for adding image to amazonResult when available
  .directive('amazonThumbnail', function () {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var imageSet;
        if (!$scope.result.ImageSets) {
          return;
        }
        $scope.result.ImageSets[0].ImageSet.forEach(function (checkSet, index) {
          if (checkSet.$ === 'primary' || !imageSet && index === $scope.result.ImageSets[0].ImageSet.length - 1) {
            imageSet = checkSet;
          }
        });

        if (imageSet) {
          var imageUrl;
          if (imageSet.MediumImage) {
            imageUrl = imageSet.MediumImage[0].URL[0];
          }
          if (!imageUrl && imageSet.SmallImage) {
            imageUrl = imageSet.SmallImage[0].URL[0];
          }
          if (!imageUrl && imageSet.ThumbnailImage) {
            imageUrl = imageSet.ThumbnailImage[0].URL[0];
          }
          $(element).append('<img class="col s2 result-thumb" src="' + imageUrl + '"></img>');
        }
      }
    };
  });
;angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'booklist.user',
  'booklist.auth',
  'booklist.search',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'ngRoute',
  'ngTouch'
])
.config(['$routeProvider', '$httpProvider', 'authProvider', 'jwtInterceptorProvider', function($routeProvider, $httpProvider, authProvider, jwtInterceptorProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    })
    .when('/profile', {
      templateUrl: '/app/shared/user.page.html',
      controller: 'UserController',
      requiresLogin: true
    })
    .when('/about', {
      templateUrl: '/app/components/about.html'
    })
    .when('/privacy', {
      templateUrl: '/app/components/privacy.html'
    })
    .when('/searchuser', {
      templateUrl: '/app/shared/user.feed.html',
      controller: 'UserFeedController',
      requiresLogin: true
    })
    .otherwise({
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    });
}])
// From auth0.com
.config(['authProvider', 'jwtInterceptorProvider', '$httpProvider', function (authProvider, jwtInterceptorProvider, $httpProvider) {

  authProvider.init({
    domain: 'rdr2.auth0.com',
    clientID: 'x3GFCfuxeqpWqPRt9HZHXjjg0MCne8VI',
    callbackURL: '#/profile',
    loginUrl: '/'
  });

  jwtInterceptorProvider.tokenGetter = ['store', function (store) {
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');

}])
.run(['$rootScope', 'auth', 'store', '$location', 'jwtHelper', function($rootScope, auth, store, $location, jwtHelper){
  auth.hookEvents();

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
          $rootScope.signedIn = true;
        }
      } else {
        $rootScope.signedIn = false;
      }
    }
  });
}]);
;// Copde taken directly from auth0.com

angular.module('booklist.auth', [])

.controller('AuthController', ['$rootScope', '$scope', '$http', 'auth', 'store', '$location', '$timeout',
  function($rootScope, $scope, $http, auth, store, $location, $timeout){
    $scope.login = function () {
      auth.signin({}, function (profile, token) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);
        $http({
          method: 'post',
          url: '/signin'
        })
        .then(function (response) {
          // Stores signed in to be used in conditions in other controllers
          $rootScope.signedIn = true;
          $location.path('/');
        })
        .catch(function (error) {
          console.error(error);
        });
      }, function (error) {
        console.log(error);
        return;
      });
    };
    $scope.logout = function() {
      // Stores signed in to be used in conditions in other controllers
      $rootScope.signedIn = false;
      auth.signout();
      store.remove('profile');
      store.remove('token');
      // Timeout for logout function to complete before path change
      $timeout(function () {
        $location.path('/');
      }, 1);
    };
  }]);
;angular.module('booklist.feed', [])

.controller('FeedController', ['$scope', 'Books', function($scope, Books){
  $scope.data = {};
  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.getBooks = function(){
    Books.getBooks()
    .then(function(resp){
      $scope.data.books = resp;
      $scope.data.books.forEach(function (book) {
        // Adds reactionSlider variable to books with a user reaction to position thumb on slider properly
        if (book.reaction) {
          // Scaled at 0-100 to assure thumb position is not affected by load order
          book.reactionSlider = (book.reaction - 1) * 25;
        }
      });
    })
    .catch(function(error){
      console.log(error);
      return;
    });
  };

  $scope.addToReadList = function (bookTitle, bookISBN, publisher, highResImage, largeImage, mediumImage, smallResImage, thumbNail, amzURL, authorName, book) {
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

    // User reaction of 0 indicates user has not read book, and book should be in to-read list
    book.reaction = 0;

    // Adds pop up message 'Added to...' when book addToReadList called
    Materialize.toast('Added to your reading list!', 1750);
  };

  $scope.getBooks();
}]);
;angular.module('booklist.search', [])

.controller('UserFeedController', ['$scope', 'Books','$rootScope', '$timeout', '$location', 'auth', function ($scope, Books, $rootScope, $timeout, $location, auth) {
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
;angular.module('booklist.user', [])

.controller('UserController', ['$scope', 'Books','$rootScope', '$timeout', '$location', '$http', '$route', 'auth', function ($scope, Books, $rootScope, $timeout, $location, $http, $route, auth) {
  $scope.user = {};
  $scope.books = [];
  $scope.path = $location.path();

  $scope.auth = auth;
  $scope.firstName = $scope.auth.profile.nickname;

  $scope.addReaction = function (reaction, book) {
    reaction = Number(reaction);
    // console.log('yolo:', book);
    Books.updateReaction(reaction, book.id)
      .then(function (success) {
        console.log('Successful reaction PUT:', success);
        if (reaction > 0) {
          book.reactionSlider = JSON.stringify(reaction * 25);
        } else {
          book.reactionSlider = '0';
        }
        book.reaction = reaction + 1;
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  // Loading spinner is hidden when false
  $scope.submitting = false;

  $scope.bookTemplate = 'app/shared/book.entry.html';

  $scope.bookTitle = '';
  $scope.authorName = '';
  $scope.publicationYear = '';
  $scope.amz_url = '';
  $scope.publisher = '';
  $scope.ISBN = '';
  $scope.reaction = undefined;
  $scope.high_res_image = '';
  $scope.medium_image = '';
  $scope.small_image = '';
  $scope.thumbnail_image = '';

  $scope.amazonResults = [];

  $scope.addToReadingList = function () {
    $scope.reaction = 0;
  };

  // $scope.deleteBookFromList = function (bookTitle) {
  //   console.log('bookTitle: ', bookTitle)
  //   console.log('deleteBookFromList has been called in user.page!');
  //   return $http({
  //     method: 'post',
  //     url: '/users/books/deleteBook',
  //     data: { title: bookTitle }
  //   })
  //   .then(function(resp) {
  //     return resp.data;
  //   }, function(error) {
  //     console.log(error);
  //     return error;
  //   });
  // };

  $scope.emptyBookLists = function (list) {
    return $http({
      method: 'post',
      url: '/users/books/emptyBookLists',
      data: { list: list }
    })
    .then(function(resp) {
      $scope.books.forEach(function (book, i) {
        if (list === 'book') {
          if (book.reaction > 0) {
            $scope.books.splice(i, 1);
          }
        } else if (list === 'read') {
          if (book.reaction === 0) {
            $scope.books.splice(i, 1);
          }
        }
      });
    }, function(error) {
      console.log(error);
      return error;
    });
  };  

  $scope.setReaction = function ($event, reaction) {
    var $target = $($event.currentTarget);
    $('.reaction-buttons').find('.selected').removeClass('selected');
    if ($scope.reaction === reaction) {
      // Removes user reaction if reaction clicked already selected
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
    // Converts slider scale of 0-100 to 1-5
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
      // If on mobile, does not auto-focus title field because keyboard would not appear when auto-focused
      if (!$target.hasClass('active') &&
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Timeouts setting focus until after enter animation completes
        setTimeout(function () {
          $('#title').focus();
        }, 250);
      }
    });

    $http({
      method: 'PUT',
      url: '/profile',
      data: {
        user: $scope.auth.profile.user_id,
        email: $scope.auth.profile.email
      }
    })
    .then(function(success) {
      // if email already exists
      if (isNaN(success.data)) {
        // logs 'User email already exists'
        console.log(success.data);
      } else {
        console.log('Successful email PUT:', success);
      }
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  // Refreshes profile each time profile is loaded
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
  };

  // Loads potential amazon matches to title/author in 'add book' form
  $scope.checkAmazon = function () {
    $scope.bookTitle = $scope.bookTitle || '';
    $scope.authorName = $scope.authorName || '';
    var title = $scope.bookTitle.trim();
    var authorName = $scope.authorName.trim();
    if (title.length || authorName.length) {
      // Shows spinner during checkAmazon
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
      $scope.amazonResults = [];
    }
  };

  var timer;
  // Sets a timer on ngChange of author and/or title. This helps limit number of Amazon API requests
  $scope.searchTimer = function () {
    // Waits until there is a pause in typing of 400 ms before querying Amazon
    $timeout.cancel(timer);
    timer = $timeout($scope.checkAmazon, 400);
  };

  // Triggered when an Amazon result is clicked
  // Stores relevant information returned from Amazon to scope variables
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

    // Sets local imageSet to first imageSet provided by Amazon
    var imageSet = result.ImageSets[0].ImageSet[0];

    // Loops through imageSets provided by Amazon
    for (var i = 1; i < result.ImageSets[0].ImageSet.length; i++) {
      var checkSet = result.ImageSets[0].ImageSet[i];
      // Sets local imageSet to primary imageSet if primary is specified by Amazon
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

    $('label[for="author"]').addClass('active');
    $('label[for="title"]').addClass('active');
    $('body').animate({
      scrollTop: $('.greet').offset().top,
      duration: 1750
    });
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
  };

  // Resets 'add book' form when book successfuly added
  $scope.clearBookInfo = function () {
    $scope.bookTitle = '';
    $scope.authorName = '';
    $scope.reaction = undefined;
    $scope.clearAmazonInfo();
    $('.reactions').find('.selected').removeClass('selected');
  };

  // Resets scope variables saved from Amazon result when title or author is changed
  $scope.clearAmazonInfo = function () {
    $scope.publicationYear = '';
    $scope.amz_url = '';
    $scope.publisher = '';
    $scope.high_res_image = '';
    $scope.ISBN = '';
    $scope.large_image = '';
    $scope.medium_image = '';
    $scope.small_image = '';
    $scope.thumbnail_image = '';
  };

  // Used for filtering front page of profile to not show books in to-read list
  $scope.filterReactions = function (element) {
    return element.reaction > 0;
  };

  $scope.initialize();
}]);
