var models = require('./models.js');

var findOrCreate = function (Model, attributes) {

  Model.forge(attributes).fetch()
  .then(function (found) {

  })
  .catch(function (err) {

  });

};