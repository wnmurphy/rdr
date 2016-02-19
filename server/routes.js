var db = require('../db/db.js');
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
      if (!author || !book) {
        res.sendStatus(409);
      } else {

        helpers.findOrCreate(Author, author)
        .then(function (author) {
          book.author_id = author.get('id');
          helpers.findOrCreate(Book, book)
          .then(function (book) {
          //posted a valid book
            res.statusCode = 201;
            res.send(JSON.stringify({
              book: {
                title: book.get('title')
              },
              author: {
                name: author.get('name')
              }
            }));
          })
          .catch(function (error) {
            console.error(error);
            res.sendStatus(409);
          });
        })
        .catch(function (error) {
          console.error(error);
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