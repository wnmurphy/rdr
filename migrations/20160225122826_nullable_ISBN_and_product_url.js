var path = require('path');
var db = require(path.resolve('db/db.js'));

exports.up = function(knex, Promise) {

  return knex.schema.table('books', function (books) {
    // books.string('amz_url');
    // books.dropIndex('ISBN', 'books_isbn_unique');
    books.index('ISBN');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('books', function (books) {
    books.dropColumn('amz_url');
    books.index('ISBN', 'books_isbn_unique');
    books.dropIndex('ISBN');
  });
};
