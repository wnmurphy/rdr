var models = require('./models.js');
var Promise = require('bluebird');

var findOrCreate = function (Model, attributes) {

  return new Promise (function (resolve, reject) {
    Model.forge(attributes).fetch()
    .then(function (model) {
      if (!model) {
        model = new Model(attributes);
      }
      model.save()
      .then(function () {
        resolve(model);
      })
      .catch(function (error) {
        reject(error);
      })
    })
    .catch(function (error) {
      reject(error);
    });

  });

};

var addBook = function (author, book, reaction) {
  
};

module.exports = {

  findOrCreate: findOrCreate

}