var path = require('path');
var public = path.resolve('public') + '/';
var helpers = require(path.resolve('server/models/helpers'));
var Author = require(path.resolve('server/models/models')).Author;
var Book = require(path.resolve('server/models/models')).Book;

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
  },
  {
    path: '/users/books',
    //TODO: take reactions into account
    'post': function (req, res) {
      var author = req.body.author;
      var book = req.body.book; 
      var reaction = req.body.reaction;
      if (!author || !book) {
        res.sendStatus(409);
      } else {
        helpers.addBook(author, book, reaction, null, 
          function(data) {
            res.statusCode = 201;
            res.send(data);
          }, function(error) {
            console.error(error)
            res.sendStatus(409);
          });
      }    
    }
  }  
];


module.exports = function (app, express) {
  app.use(express.static(public + '/client'));

  routes.forEach(function (route){
    for (var key in route) {
      if (key === 'path') { continue; }
      app[key](route.path, route[key]);
    }
  });
};