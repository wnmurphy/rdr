var path = require('path');
var public = path.resolve('public') + '/';
var helpers = require(path.resolve('server/models/helpers'));
var Author = require(path.resolve('server/models/models')).Author;
var Book = require(path.resolve('server/models/models')).Book;
var amazon = require('amazon-product-api');
var url = require('url');
var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var jwtCheck = expressjwt({
  secret: new Buffer(process.env.AUTH_SECRET, 'base64'),
  audience: process.env.AUTH_ID
});

// add routes you want to block here
var authRoutes = [

];

var routes = [
  {
    path: '/',
    get: function(req, res) {
      res.sendFile(public + 'client/index.html');
    }
  },
  {
    path: '/users/books',
    post: function (req, res) {
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
            console.error(error);
            res.sendStatus(409);
          });
      }
    }
  },
  {
    path: '/books',
    get: function (req, res) {
      var limit = req.param('limit');
      var list = req.param('list');
      helpers.getBooks(list, limit, function (books) {
        res.send(books);
      }, function (error) {
        console.error(error);
        res.sendStatus(409);
      });
    }
  },
  {
    path: '/amazon',
    get: function (req, res) {
      var url_parts = url.parse(req.url, true);
      var query = url_parts.query;
      console.log(query.title);
      var client = amazon.createClient({
        awsId: process.env.AWS_ACCESS_KEY_ID,
        awsSecret: process.env.AWS_SECRET_KEY,
        awsTag: process.env.AWS_ASSOCIATES_ID
      });
      client.itemSearch({
        searchIndex: 'Books',
        keywords: query.title,
        author: query.authorName || ''
      })
      .then(function (results) {
        console.log(results);
        res.send(results);
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        res.send(error);
      });
    }
  },
  {
    path: '/profile',
    get: function (req, res) {
      var profile = {};
      var id = req.param('id');
      if (id) {
        profile.id = id;
      } else {
        profile = grabProfile(req);
      }
      helpers.getProfile(profile, function (books) {
        res.send(books);
      }, function (error) {
        console.log(error);
        res.sendStatus(409);
      });
    }
  },
  {
    path: '*',
    get: function (req, res) {
      res.redirect('/');
    }
  },
];

var grabProfile = function (req) {
  // TODO this needs to pull profile data out of request
  var token = req.headers.authorization;
  if (token === undefined) {
    return null;
  }
  token = token.split(' ')[1];
  var decoded = jwt.verify(token, process.env.AUTH_SECRET);
  var id = decoded.sub;

  return {
   'amz_auth_id': id
  };
};

var storeProfile = function (req, res, next) {
  var profile = grabProfile(req);
  if (profile) {
    helpers.saveProfile(grabProfile(req));
  }
  next();
};

module.exports = function (app, express) {
  app.use(express.static(public + '/client'));

  // stores profile not in db with each request
  app.use(storeProfile);

  // block unathorized access to authRoutes
  authRoutes.forEach(function (route){
    app.use(route, jwtCheck);
  });

  routes.forEach(function (route){
    for (var key in route) {
      if (key === 'path') { continue; }
      app[key](route.path, route[key]);
    }
  });
};
