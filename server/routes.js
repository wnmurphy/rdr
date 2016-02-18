var path = require('path');
var public = path.resolve('public') + '/';

var routes = [
  {
    path: '/',
    'get': function(req, res) {
      res.sendFile(public + 'client/index.html');
    }
  },
  {
    path: '*',
    get: function (req, res) {
      res.redirect('/');
    }
  }  
];

module.exports = function (app, express) {
  app.use(express.static(public + '/client'))

  routes.forEach(function (route){
    for (var key in route) {
      if (key === 'path') { continue; }
      app[key](route.path, route[key]);
    }
  });
};