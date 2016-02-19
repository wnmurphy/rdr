angular.module('booklist.auth', [])

.controller('LoginController', ['$scope', '$http', 'auth', 'store', '$location', 
  function($scope, $http, auth, store, $location){
    $scope.login = function () {
      auth.signin({}, function (profile, token) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);
        $location.path('/');
      }, function () {
        // Error callback
      });
    };
  }]);

// <!-- login.tpl.html -->
// <!-- ... -->
// <input type="submit" ng-click="login()" />
// <!-- ... -->