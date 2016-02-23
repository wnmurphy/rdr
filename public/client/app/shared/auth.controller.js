angular.module('booklist.auth', [])

.controller('AuthController', ['$rootScope', '$scope', '$http', 'auth', 'store', '$location', 
  function($rootScope, $scope, $http, auth, store, $location){
    $scope.login = function () {
      auth.signin({}, function (profile, token) {
        // Success callback
        $rootScope.signedIn = true;
        store.set('profile', profile);
        store.set('token', token);
        $location.path('/');
      }, function (error) {
        console.log(error);
        return;
      });
    };
    $scope.logout = function() {
      $rootScope.signedIn = false;
      auth.signout();
      store.remove('profile');
      store.remove('token');
    }
  }]);