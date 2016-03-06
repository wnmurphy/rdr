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

// Returns books in descending order of average reaction
var getBooks = function (list, limit, success, fail) {
  db.knex.select('books.*', 'authors.name')
  .where('books_users.reaction', '>', 0)
  .avg('books_users.reaction as avgReaction')
  .from('books')
  .limit(limit)
  .orderBy('avgReaction', 'desc')
  .innerJoin('books_users', 'books.id', 'books_users.book_id')
  .groupBy('books.id')
  .innerJoin('authors', 'books.author_id', 'authors.id')
    .then(function (books) {
      books.forEach(function (book) {
        var authorName = book.name;
        delete book.name;
        book.author = {};
        book.author.name = authorName;
      });
      success(books);
    })
    .catch(fail);
};

// Returns books in descending order of average reaction
var deleteBook = function (bookTitle, user, success, fail) {
  db.knex('users.*')
  // .dropForeign('books_users.book_id')  
  .from('books') 
  .innerJoin('books_users', 'books.id', 'books_users.book_id')
  .innerJoin('users', 'books_users.user_id', 'users.id')
  .where('books.title', bookTitle)
  // .andWhere('users.amz_auth_id', user.amz_auth_id)      
  // .del()                                   
    .then(function (result) {
      console.log(result);

      // books.forEach(function (book) {
      //   if(book.title === bookTitle){
        //   db.knex.del(book);
        //console.log(book);
        // }
      // });
      // success(200);
    })
    .catch(fail);
};


// Deletes all entries in both book lists for current user.
var emptyBookLists = function (user, success, fail) {
  
  // Use amz_auth_id to get users.id.
  var user_id = 
  db.knex('users')
  .select('users.id')
  .where('users.amz_auth_id', user.amz_auth_id);

  // Delete all records for user in books_users.
  db.knex('books_users')
  .innerJoin('users', 'books_users.user_id', 'users.id') 
  .where('books_users.user_id', user_id)
  .del() 
  .then(function (results) {
    success();
  }).catch(fail);
};


// Returns all books that have been read
// Includes user's reaction if user's reaction exists
var getBooksSignedIn = function (list, limit, user, success, fail) {
  findOrCreate(models.User, user)
    .then(function (user) {
      db.knex.select('books.*', 'authors.name')
      .where('books_users.reaction', '>', 0)
      .avg('books_users.reaction as avgReaction')
      .from('books')
      .limit(limit)
      .orderBy('avgReaction', 'desc')
      .innerJoin('books_users', 'books.id', 'books_users.book_id')
      .whereNot('books_users.user_id', user.get('id'))
      .groupBy('books.id')
      .innerJoin('authors', 'books.author_id', 'authors.id')
      .then(function (books) {
        db.knex.select('books.*', 'authors.name')
        .from('books')
        .limit(limit)
        .innerJoin('books_users', 'books.id', 'books_users.book_id')
        .where('books_users.user_id', user.get('id'))
        .select('books_users.reaction as reaction')
        .groupBy('books.id')
        .innerJoin('authors', 'books.author_id', 'authors.id')
          .then(function (userBooks) {
            var uniqueBooks = [];
            books.forEach(function (book) {
              var unique = true;
              userBooks.forEach(function (userBook) {
                if (book.id === userBook.id) {
                  unique = false;
                  // Stores avgReaction to userBook becasue
                  // avgReaction not saved when usersBooks lookup occurs
                  userBook.avgReaction = book.avgReaction;
                }
              });
              if (unique) {
                uniqueBooks.push(book);
              }
            });
            books = uniqueBooks.concat(userBooks);
            books.forEach(function (book) {
              var authorName = book.name;
              delete book.name;
              book.author = {};
              book.author.name = authorName;
              // Stores user reaction as avgReaction if there is no avgReaction
              if (!book.avgReaction) {
                book.avgReaction = book.reaction;
              }
            });
            // Sorts by avgReaction in descending order
            books.sort(function (a, b) {
              return b.avgReaction - a.avgReaction;
            });
          success(books);
        });
      });
    });
};

var saveProfile = function (profile, success, fail) {
  findOrCreate(models.User, {amz_auth_id: profile})
    .then(function (user) {
      success(user);
    })
    .catch( function (error) {
      fail(error);
    });
};

// Returns profile information and all books belonging to that profile
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
    .then(function (user) {
      if (user) {
        db.knex.select('books.*', 'authors.name')
          .avg('books_users.reaction as avgReaction')
          .from('books')
          .orderBy('id', 'asc')
          .innerJoin('books_users', 'books.id', 'books_users.book_id')
          .where('books_users.user_id', user.get('id'))
          .select('books_users.reaction as reaction')
          .groupBy('books.id')
          .innerJoin('authors', 'books.author_id', 'authors.id')
            .then(function (books) {
              books.forEach(function (book) {
                var authorName = book.name;
                delete book.name;
                book.author = {};
                book.author.name = authorName;
              });
              success({books: books});
            });
      } else {
        throw 'no user found';
      }
    });
};

var insertEmail = function(amzId, email, success, fail) {
  db.knex.select('email')
    .from('users')
    .where('amz_auth_id', amzId)
    .update( { email: email } )
      .then(function (res) {
        success(res);
      })
      .catch(function (error) {
        fail(error);
      });
};

var getUsersBooks = function(email, success, fail) {
  var book_ids = [];
  var bookIdReactions = {};
  db.knex.select('id')
    .from('users')
    .where('email', email)
      .then(function (data) {
        db.knex.select('book_id', 'reaction')
          .from('books_users')
          .where('user_id', data[0].id)
            .then(function (res) {
              res.forEach(function (obj) {
                book_ids.push(obj.book_id);
                bookIdReactions[obj.book_id] = obj.reaction;
              });
              db.knex.select()
                .from('books')
                .whereIn('id', book_ids)
                  .then(function (books) {
                    books.forEach(function (book) {
                      if (bookIdReactions[book.id] !== undefined) {
                        book.reaction = bookIdReactions[book.id];
                      }
                    });
                    success(books);
                  }).catch(function (err) {
                    console.error(err);
                  });
            })
            .catch(function (err) {
              console.error(err);
            });
      })
      .catch(function (err) {
        fail(err);
      });
};

module.exports = {

  insertEmail: insertEmail,
  getUsersBooks: getUsersBooks,
  findOrCreate: findOrCreate,
  addBook: addBook,
  getBooks: getBooks,
  getBooksSignedIn: getBooksSignedIn,
  saveProfile: saveProfile,
  getProfile: getProfile,
  deleteBook: deleteBook,
  emptyBookLists: emptyBookLists
};
