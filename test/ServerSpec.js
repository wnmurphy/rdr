var expect = require('chai').expect;
var Author = require(__dirname + '/../server/models/book.js').Author;
var Book = require(__dirname + '/../server/models/book.js').Book;


//
describe('', function() {

  beforeEach(function() {
    
  });

  describe('Bookshelf models: ', function() {

    it('Should retrieve author from book', function(done) {
      var author = new Author({
        name: 'Dr. Seuss'
      });
      author.save().then( function () {
        var book = new Book({
          title: 'Cat in the Hat',
          author_id: author.get('id')
        });

        book.save().then(function () {

          Book.forge({title: 'Cat in the Hat'}).fetch({withRelated: ['author']})
          .then(function (book) {
            expect(book.related('author')).to.deep.equal(author);
            done();
          });
        });
      });
    });

  }); 

});
