var env = require('node-env-file');
var path = require('path');

if (process.env.NODE_ENV !== 'production') {
  env(path.resolve('.env'));
}

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'booklist',
      charset: 'utf8'
    },
    seeds: {
      directory: './seeds/dev'
    }
  }
};