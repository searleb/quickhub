const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    background: './src/background.js'
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: './index.html',
      excludeChunks: ['background']
    })
  ]
};
