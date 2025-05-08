module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['istanbul']
          }
        },
        exclude: /node_modules|\.spec\.ts$/
      }
    ]
  }
};
