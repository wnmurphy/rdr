angular.module('books.services', [])

  .factory('Books', ['$http', function($http){
   var getBooks = function(){
    return $http({
      method: 'GET',
      url: '/books'
    })
   }
  }])
