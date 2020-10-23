const path = require('path');

// loaders-----------------------------------------------------
const css = {
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
  ]
};
const images = {
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true,
        disable: true,
        optipng: {
          enabled: true,
        },
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75,
        }
      },
    },
  ],
};
const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    'file-loader',
  ],
};
// config------------------------------------------------------
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [css, images, fonts],
  },
}