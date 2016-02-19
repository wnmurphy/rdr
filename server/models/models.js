var db = require(__dirname + '/../../db/db.js');

var Book = db.Model.extend({
  tableName: 'books',
  author: function() {
    return this.belongsTo(Author, 'author_id');
  },
  users: function () {
    return this.belongsToMany(User, 'books-users', 'user_id', 'book_id');
  }
});

var Author = db.Model.extend({
  tableName: 'authors',
  books: function () {
    return this.hasMany(Book, 'author_id');
  }
});

var Reaction = db.Model.extend({
  tableName: 'reactions',
});

var User = db.Model.extend({
  tableName: 'users',
  books: function () {
    return this.belongsToMany(Book, 'books-users', 'book_id', 'user_id');
  }
});

var Read = db.Model.extend({
  tableName: 'books-users',
});

module.exports = {
  Book: Book,
  Author: Author,
  Reaction: Reaction,
  User: User
};