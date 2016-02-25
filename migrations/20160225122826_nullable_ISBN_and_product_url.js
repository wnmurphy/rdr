var path = require('path');
var db = require(path.resolve('db/db.js'));

exports.up = function(knex, Promise) {

  return knex.schema.table('books', function (books) {
    books.string('amz_url');
    books.dropIndex('ISBN', 'ISBN');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('books', function (books) {
    books.dropColumn('amz_url');
    books.index('ISBN', 'ISBN');
  });
};
