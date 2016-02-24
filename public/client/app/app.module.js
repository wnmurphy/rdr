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
          
  }]);
