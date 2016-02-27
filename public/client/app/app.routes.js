angular.module('booklist', [
  'booklist.services',
  'booklist.feed',
  'booklist.user',
  'booklist.auth',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'ngRoute'
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
    .otherwise({
      templateUrl: '/app/shared/book.feed.html',
      controller: 'FeedController'
    });
}])
.config(['authProvider', 'jwtInterceptorProvider', '$httpProvider', function (authProvider, jwtInterceptorProvider, $httpProvider) {

  authProvider.init({
    domain: 'thebooklist.auth0.com',
    clientID: 'KVmjN4H2bQUdJspERpFnHhSRl8cA12b6',
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
        $location.path('/');
      }
    } else {
      $location.path('/');
    }
  });
}]);
