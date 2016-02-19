var db = require(__dirname + '/../../db/db.js');

var Book = db.Model.extend({
  tableName: 'books',
  author: function() {
    return this.belongsTo(Author, 'author_id');
  }
  // TODO add reactions and users
});

var Author = db.Model.extend({
  tableName: 'authors',
  books: function () {
    return this.hasMany(Book);
  }
});

var Reaction = db.Model.extend({
  tableName: 'reactions',
  userBookReactions: function () {
    return this.hasMany(UserBook).through(UserBookReaction);
  }
});

var User = db.Model.extend({
  tableName: 'users',
  books: function () {
    return this.hasMany(Book).through(UserBook);
  }
});

module.exports = {
  Book: Book,
  Author: Author,
  Reaction: Reaction,
  Book: Book
};