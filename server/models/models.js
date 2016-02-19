var db = require(__dirname + '/../../db/db.js');

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

//TODO write model for Reaction

//TODO write model for User

module.exports = {
  Book: Book,
  Author: Author
};