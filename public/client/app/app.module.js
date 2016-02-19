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

   var postBook = function (bookName, authorName, userID, reaction){
    return $http({
      method: 'POST',
      url: '/users/books',
      data: {'bookName': bookName, 'authorName': authorName, 'userID': userID, 'reaction': reaction}
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
