var path = require('path');
var expect = require('chai').expect;
var db = require(path.resolve('db/db'));
var Author = require(__dirname + '/../server/models/models.js').Author;
var Book = require(__dirname + '/../server/models/models.js').Book;
var helpers = require(path.resolve('server/models/helpers'));


//
describe('', function() {

  beforeEach(function() {
    
  });

  describe('Bookshelf ', function() {

    it('Should retrieve author from book', function(done) {
      Author.forge({name: 'Dr. Seuss'}).fetch()
        .then(function (author) {
          if (!author) {
            author = new Author({name: 'Dr. Seuss'});
          }
          author.save().then( function () {
            var book = new Book({
              title: 'Cat in the Hat',
              author_id: author.get('id')
            });

            book.save().then(function () {

              Book.forge({title: 'Cat in the Hat'}).fetch({withRelated: ['author']})
              .then(function (book) {
                for (var key in book.related('author').attributes) {
                  expect(book.related('author')[key]).to.equal(author[key]);
                }
                done();
              });
            });
          });
        });
    });

    describe('Find or create', function () {
      it('Should provide an object', function(done) {
        helpers.findOrCreate(Author, {name: 'Chicken Salad'})
        .then(function (newAuthor) {
          expect(newAuthor).to.be.an('object');
          done();
        });
      });

      it('Should retrieve the existing model when one exists', function(done) {
        Author.forge({}).fetch()
        .then(function (author) {
          var id = author.get('id');
          helpers.findOrCreate(Author, author.attributes)
          .then(function (retrieved) {
            expect(retrieved.get('id')).to.equal(id);
            done();
          });
        });
      });

      it('Should create a new model when there are no matches', function(done) {
        db.knex('authors').max('name').then(function (name) {
            var checkName;
            for (var key in name[0]) {
              checkName = name[0][key];
            }
            db.knex('authors').max('id').then(function (id) {
            helpers.findOrCreate(Author, {name: checkName + 'z'})
            .then(function (retrieved) {
              var checkID;
              for (var key in id[0]) {
                checkID = id[0][key];
              }
              expect(retrieved.get('id')).to.be.above(checkID);
              done();     
              retrieved.destroy();   
            });
          });
        });
      });
    });
  }); 
});
