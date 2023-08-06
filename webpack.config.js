const path = require('path');

module.exports = {
  //development and production
  mode: process.env.NODE_ENV || 'development',
  entry: './public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/js'),
  },
  watch: true,
};
