angular.module('booklist.services', [])

  .factory('Books', ['$http', function($http){
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

    var postBook = function (bookName, authorName, reaction){
     return $http({
       method: 'POST',
       url: '/users/books',
       data: {book: {title: bookName}, author: {name: authorName}, reaction:{id: reaction}}
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
     getBooks: getBooks,
     postBook: postBook,
     queryAmazon: queryAmazon
    }
  }
  ]
);
