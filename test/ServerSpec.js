var path = require('path');
var expect = require('chai').expect;
var db = require(path.resolve('db/db'));
var Author = require(__dirname + '/../server/models/models.js').Author;
var Book = require(__dirname + '/../server/models/models.js').Book;
var helpers = require(path.resolve('server/models/helpers'));
var request = require('request');


describe('', function() {

  beforeEach(function() {
    
  });

  describe('Bookshelf ', function() {

    describe('Models', function () {
      describe('Book', function() {
        var author, book;
        it('Should retrieve author from book', function(done) {
          Author.forge({name: 'Dr. Seuss'}).fetch()
            .then(function (found) {
              author = found;
              if (!author) {
                author = new Author({name: 'Dr. Seuss'});
              }
              author.save().then( function () {
                book = new Book({
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
                    book.destroy();
                  });
                });
              });
            });
          });
        it('Should count how many people have read book', function(done) {
          // TODO write test for checking books popularity
          expect(book.popularity).to.be.a('function');
          expect(book.popularity()).to.be.a('number');
          expect(true).to.equal(false);
          done();
        });
      });
    });
    
    describe('Helper functions', function () {
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
      
      describe('addBook', function () {
        it('Should add a book to the database', function(done) {
          helpers.addBook({name: 'Leo Tolstoy'}, {title: 'War and Peace'}, null, null,
            function(data){
              data = JSON.parse(data);
              expect(typeof data.book.id).to.equal('number');
              expect(typeof data.author.id).to.equal('number');
              expect(data.book.title).to.equal('War and Peace');
              expect(data.author.name).to.equal('Leo Tolstoy');
              done();
            }, function (error) {
              console.log(error);
            });
        });
      });
      
      describe('getBooks', function () {
        it('Should return books', function (done) {
          helpers.getBooks(null, null, function(books) {
            expect(Object.keys(books[0])).to.deep.equal(['id', 'title', 'author_id', 'amazon_id', 'publisher', 'pub_year']);
            done();
          }, function (error) {
            console.log(error);
          });
        });
        
        it('Should limit number of books when limit is provided', function (done) {
          helpers.getBooks(null, 4, function(books) {
            expect(books.length).to.equal(4);;
            done();
          }, function (error) {
            console.log(error);
          });
        });
      });
    });
  });
  describe('Server', function () {
    describe('REST API', function () {
      it('Should return 409 when posting/patching an invalid book', function(done) {
        request.post('http://127.0.0.1:8080/users/books', function (err, res, body){
          expect(res.statusCode).to.equal(409);
          done();
        });
      });
      it('Should return 201 and valid objects when a new book is posted', function(done) {

        var options = {
          'method': 'POST',
          'followAllRedirects': true,
          'uri': 'http://127.0.0.1:8080/users/books',
          'json': {
            'book': {
              title: 'Oh the Places You\'ll Go',
            },
            'author': {
              name: 'Dr. Seuss'
            }
          }
        };
        request(options, function (err, res, body) {
          expect(res.statusCode).to.equal(201);
          expect(res.body.book).to.be.an('object');
          expect(res.body.author).to.be.an('object');
          done();
        });
      });
    });
  }); 
});
