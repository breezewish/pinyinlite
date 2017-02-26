var argv = require('yargs').argv;

module.exports = {
  entry: {
    common: './index_common.js',
    full: './index_full.js',
  },
  output: {
    path: './dist',
    filename: argv.env === 'production' ? 'pinyinlite_[name].min.js' : 'pinyinlite_[name].js',
    library: 'pinyinlite',
  },
};
