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
      })
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
      //posted a valid book
        var resData = (JSON.stringify({
          book: {
            title: book.get('title')
          },
          author: {
            name: author.get('name')
          }
        }));
        
        success(resData);
      })
      .catch(function (error) {
        fail(error);
      });
    })
    .catch(function (error) {
      fail(error);
    });  
  
};

module.exports = {

  findOrCreate: findOrCreate,
  addBook: addBook

}