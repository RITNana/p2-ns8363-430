// like babbel - bundling our modules :)

const path = require('path');

module.exports = {
  entry: {
    app: './client/main.jsx',
    login: './client/login.jsx',
    preference: './client/preferences.jsx',
    review: './client/reviewer.jsx'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  mode: 'production',
  watchOptions: {
    aggregateTimeout: 200,
  },
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: '[name]Bundle.js',
  },
};
