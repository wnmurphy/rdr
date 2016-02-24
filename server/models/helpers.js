var db = require(__dirname + '/../../db/db.js');
var models = require('./models.js');
var Promise = require('bluebird');

var findOrCreate = function (Model, attributes) {

  return new Promise (function (resolve, reject) {
    Model.forge(attributes).fetch()
    .then(function (model) {
      if (!model) {
        model = new Model(attributes);
      }
      model.save()
      .then(function () {
        resolve(model);
      })
      .catch(function (error) {
        reject(error);
      });
    })
    .catch(function (error) {
      reject(error);
    });

  });

};

var addBook = function (author, book, reaction, user, success, fail) {
  // TODO handle users reactions

  findOrCreate(models.Author, author)
    .then(function (author) {
      book.author_id = author.get('id');
      findOrCreate(models.Book, book)
      .then(function (book) {
        models.User.forge(user)
          .fetch()
          .then( function (user) {
            findOrCreate(models.Read, {
              user_id: user.get('id'),
              book_id: book.get('id')
            })
            .then( function (read) {
              read.set('reaction', reaction);
              read.save()
                .then(function () {
                  var resData = (JSON.stringify({
                    book: {
                      title: book.get('title'),
                      id: book.get('id')
                    },
                    author: {
                      id: book.get('id'),
                      name: author.get('name')
                    },
                    reaction: read.get('reaction')
                  }));
                  success(resData);
                });
            });
          });

      })
      .catch(function (error) {
        fail(error);
      });
    })
    .catch(function (error) {
      fail(error);
    });
};
//this function returns books in descending order of average reaction
var getBooks = function (list, limit, success, fail) {
  db.knex.select('books.*', 'authors.name')
  .avg('books_users.reaction as avgReaction')
  .from('books')
  .limit(limit)
  .orderBy('reaction', 'desc')
  .innerJoin('books_users', 'books.id', 'books_users.book_id')
  .groupBy('books.id')
  .innerJoin('authors', 'books.author_id', 'authors.id')
    .then(function (books) {
      books.forEach(function (book) {
        var authorName = book.name;
        delete book.name;
        book.author = {};
        book.author.name = authorName;
      })
      success(books);
    })
};

var saveProfile = function (profile, success, fail) {
  console.log(profile);
  //new models.User({'amz_auth_id': profile})
    //.fetch()
  findOrCreate(models.User, {amz_auth_id: profile})
    .then(function (user) {
      console.log(JSON.stringify(arguments));
      success(user);
      /*var userProfile = new models.User({
        'amz_auth_id': profile.user_id,
        'email': profile.email,
        'name': profile.name
      })

      // sets the id if a user profile was found
      if(user) {
        userProfile.id = user.get('id');
      }

      // inserts when new and updates if existing
      userProfile.save();*/

    })
    .catch( function (error) {
      fail(error);
    });
};

var getProfile = function (profile, success, fail) {
  var key = 'amz_auth_id';
  var value = profile.amz_auth_id;
  if (profile.user_id) {
    key = 'id';
    value = profile.user_id;
  }
  var attributes = {};
  attributes[key] = value;
  findOrCreate(models.User, attributes)
    //.fetch({withRelated: ['books']})
    .then(function (user) {
      if (user) {
        db.knex('books_users').where('user_id', user.get('id'))
        .innerJoin('books', 'books_users.book_id', 'books.id')
        .innerJoin('authors', 'books.author_id', 'authors.id')
          .then(function (books) {
            books.forEach(function (book) {
              var authorName = book.name;
              delete book.name;
              book.author = {};
              book.author.name = authorName;
            })
            success({books: books});
          })

        /*models.Read.forge({user_id: user.get('id')}).fetchAll()
        .then(function (reads) {
          console.log(reads);
          models.Book.collection().fetch({withRelated: 'author'})
          .then(function (books) {
            console.log(books);
          });
          //success(books);
        });*/
      } else {
        throw 'no user found';
      }
    });
};

module.exports = {

  findOrCreate: findOrCreate,
  addBook: addBook,
  getBooks: getBooks,
  saveProfile: saveProfile,
  getProfile: getProfile

};
