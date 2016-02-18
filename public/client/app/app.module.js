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

   var postBook = function (bookID, userID, reaction){
    return $http({
      method: 'POST',
      url: '/users/books',
      data: {'bookID': bookID, 'userID': userID, 'reaction': reaction}
    })
    .then(function(resp){
      return resp.data;
    }, function(error){
      console.log(error);
      return error;
    });
   };

   return {
    getBooks: getBooks,
    postBook: postBook
   };

  }]);
