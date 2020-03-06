const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer= [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin(), // by default it uses cssnano
    ];
  }
  return config;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
        ],
      },
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
        publicPath: '/',// - for images right path ('/dist' - for filesystem)

      }
    }, 
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: function () { // post css plugins, can be exported to postcss.config.js
          return [
            require('css-mqpacker'),
            require('autoprefixer')
          ];
        }
      }
    },
  ];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
};

const htmlPluginInstance = () => { //Automatic creation any html pages
  const pages = fs
  .readdirSync('./src/pug') // pages_dir
  .filter(fileName => fileName.endsWith('.pug'));

  return pages.map(
    page =>
      new HTMLWebpackPlugin({
        template: `./pug/${page}`, // because of context: path.resolve(__dirname, 'src')
        filename: `./${page.replace(/\.pug/,'.html')}`,//`./${page}` output must be html
        minify: {
          collapseWhitespace: isProd,
        },
      })
  );
};



module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  entry: {
    main: ['whatwg-fetch', '@babel/polyfill', './index.js'],
    analytics: './analytics.js',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    watchContentBase: true,
    port: 8081,
    hot: isDev,
    overlay: true,
  },
  devtool: isDev ? 'source-map' : '', // 'eval-source-map' - faster, but without css maps
  optimization: optimization(),
  plugins: [
    ...htmlPluginInstance(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/img/favicon/'),
        to: path.resolve(__dirname, 'dist/img/favicon/'),
      },
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      { test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true, // to stop minifying HTML here, it happens in HTMLWebpackPlugin
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
        // use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
            // outputPath: 'img', // [path] contains 'img'
            name: '[path][name].[ext]' // [contenthash].[ext]
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              // webp: {
              //   quality: 75
              // }
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name]/[name].[ext]',
          outputPath: 'fonts',
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
    ],
  },
};

// module.exports = (env, options) => {
//   console.log('options.mode:', options.mode);
//   return config;
// };