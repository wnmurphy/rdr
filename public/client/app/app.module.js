angular.module('booklist.services', [])

  .factory('Books', ['$http', function ($http){
    var getBooks = function(){
     return $http({
       method: 'GET',
       url: '/books'
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
      })
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

    return {
      getProfile: getProfile,
      getBooks: getBooks,
      postBook: postBook,
      queryAmazon: queryAmazon
    };
  }])
  .run(['$rootScope', function ($rootScope){

    $rootScope.reactions = {
      1: 'Hate it',
      2: 'Dislike it',
      3: 'Decent',
      4: 'Like it',
      5: 'Love it'
    };

    $rootScope.Math = window.Math;

    $rootScope.blankCovers = ['/assets/img/black_cover.png', '/assets/img/red_cover.jpg'];

  }])
  .directive('amazonThumbnail', function () {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var imageSet;
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
