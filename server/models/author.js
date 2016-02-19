var db = require(__dirname + '/../../db/db.js');
var Book = require('./book.js');

var Author = db.Model.extend({
  tableName: 'authors',
  books: function () {
    return this.hasMany(Book);
  }
});

module.exports = Author;