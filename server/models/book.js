var db = require(__dirname + '/../../db/db.js');
// var Author = require('./author.js');

var Book = db.Model.extend({
  tableName: 'books',
  author: function() {
    return this.belongsTo(Author, 'author_id');
  }
});

var Author = db.Model.extend({
  tableName: 'authors',
  books: function () {
    return this.hasMany(Book, 'book_id');
  }
});

module.exports = {
  Book: Book,
  Author: Author
};