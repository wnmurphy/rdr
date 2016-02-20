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
    },
    'get': function (req, res) {
      var limit = req.param('limit');
      var list = req.param('list');
    }
  }
];

var grabProfile = function (req, res, next) {
  // TODO this needs to pull profile data out of request
  
  // temporarily return demo values in proper format
  var profile = {
    "email":"josh.riesenbach+demo@gmail.com",
    "email_verified":false,
    "clientID":"3y4I7YR2w0tbSitWGGA5aedYF8Apx4ts",
    "username":"joshdemo",
    "updated_at":"2016-02-20T03:09:35.414Z",
    "picture":"https://s.gravatar.com/avatar/4fb89d4ef0d1cecf1fb0a4998b5cf0af?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
    "user_id":"auth0|56c52f3d9e19260a767416ad",
    "name":"josh.riesenbach+demo@gmail.com",
    "nickname":"joshdemo",
    "identities":[{
      "user_id":"56c52f3d9e19260a767416ad",
      "provider":"auth0",
      "connection":"Username-Password-Authentication",
      "isSocial":false}
    ],
    "created_at":"2016-02-18T02:41:01.867Z",
    "global_client_id":"VrUBkWRzkkJXumJO6bmUNZQoHUscIOcs"
  }
  // REMOVE LATER ^^^^^^^^^
  
  helpers.saveProfile(profile);
}


module.exports = function (app, express) {
  app.use(express.static(public + '/client'));
  
  // stores profile not in db with each request
  app.use(grabProfile);

  routes.forEach(function (route){
    for (var key in route) {
      if (key === 'path') { continue; }
      app[key](route.path, route[key]);
    }
  });
};