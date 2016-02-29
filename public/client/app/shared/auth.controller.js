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
          console.log(response);
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
      $rootScope.signedIn = false;
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $timeout(function () {
        $location.path('/');
      }, 1);
    };
  }]);
