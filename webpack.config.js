const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

// variables---------------------------------------------------
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
// helper functions--------------------------------------------
const optimization = () => {
  const config = {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  }

  if (isProd) {
    config.minimize = true,
    config.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        exclude: /node_modules/,
      }),
    ]
  }
  return config
}
// loaders-----------------------------------------------------
const pug = {
  test: /\.pug$/,
  include: path.resolve(__dirname, 'src'),
  use: [{
    loader: 'pug-loader',
    options: {
        root: path.resolve(__dirname, 'src'),
    }
  }]
};
const sass = {
  test: /\.(css|sass|scss)$/i,
  include: path.resolve(__dirname, 'src'),
  use: [
    isDev ? 'style-loader' : { 
    loader: MiniCssExtractPlugin.loader, 
      options: {
          hmr: isDev,
          reloadAll: true,
      },
    },
    { loader: 'css-loader', options: {sourceMap: isDev} },
    { loader: 'postcss-loader', options: { sourceMap: isDev } },
    { loader: 'resolve-url-loader' },
    { loader: 'sass-loader', options: {sourceMap: isDev} },
  ]
};
const images = {
  test: /\.(png|svg|jpg|gif)$/,
  include: path.resolve(__dirname, 'src'),
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true,
        disable: false,
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
  include: path.resolve(__dirname, 'src'),
  use: [
    'file-loader',
  ],
};
const ts = {
  test: /\.ts?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    configFile: isProd ? 'tsconfig.prod.json' : 'tsconfig.json',
    // transpileOnly: true,
  },
}
// config------------------------------------------------------
module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: './src/index.ts'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [ts, sass, images, fonts, pug],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name]/style.[contenthash].css' : '[name]/style.css',
    }),
    new HtmlWebpackPlugin({
      title: 'Slider page',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.pug'),
      minify: {
        removeComments: isProd,
        collapseWhiteSpace: isProd,
        removeRedundantAttributes: isProd,
        useShortDoctype: isProd
      }
    })
  ],
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    compress: true,
    hot: isDev,
    port: 8080,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      root: path.resolve(__dirname, 'src/'),
    }
  },
  optimization: optimization(), 
}