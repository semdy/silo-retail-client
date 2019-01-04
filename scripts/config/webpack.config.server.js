'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const pxtorem = require('postcss-pxtorem');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"server"') {
  throw new Error('Production builds must have NODE_ENV=server.');
}

const cssFilename = 'static/styles/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? {publicPath: Array(cssFilename.split('/').length).join('../')}
  : {};

const extractCSSFromLoader = (loaderName) => {
  const baseOptions = {
    fallback: 'style-loader',
    use: [
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          minimize: true,
          modules: true,
          localIdentName: '[local]__[hash:base64:5]',
          sourceMap: shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9'
              ],
              flexbox: 'no-2009',
            }),
            pxtorem({
              rootValue: 37.5,
              propList: ['*', '!font', '!font-size',],
              selectorBlackList: [/^html$/]
            })
          ],
        },
      }
    ]
  };

  if (loaderName) {
    baseOptions.use.push(loaderName);
  }

  return ExtractTextPlugin.extract(
    Object.assign(
      baseOptions,
      extractTextPluginOptions
    )
  )
};

module.exports = {
  target: 'node',
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: {
    renderer: paths.appServer
  },
  output: {
    path: paths.appBuild,
    filename: 'static/scripts/[name].js',
    libraryTarget: 'commonjs2',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  cache: true,
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appServer,
      },
      {
        oneOf: [
          {
            test: /\.(bmp|png|jpe?g|gif|woff|woff2|ttf|otf)$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/images/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.svg$/,
            use: [
              "babel-loader",
              {
                loader: "react-svg-loader",
                options: {
                  jsx: true, // true outputs JSX tags
                  svgo: {
                    plugins: [
                      {removeTitle: false}
                    ],
                    floatPrecision: 2
                  }
                }
              }
            ]
          },
          {
            test: /\.svg$/,
            include: paths.appIcons,
            use: [
              {
                loader: 'svg-sprite-loader'
              }
            ]
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
            include: paths.appSrc
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: [
              paths.appSrc,
              paths.appServer,
            ],
            loader: require.resolve('babel-loader'),
            options: {
              compact: true,
            },
          },
          {
            test: /\.css$/,
            loader: extractCSSFromLoader()
          },
          {
            test: /\.scss$/,
            loader: extractCSSFromLoader('sass-loader')
          },
          {
            test: /\.less$/,
            loader: extractCSSFromLoader('less-loader')
          },
          {
            test: /\.styl$/,
            loader: extractCSSFromLoader('stylus-loader')
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/, /\.less$/, /\.styl$/],
            options: {
              name: 'static/images/[name].[hash:8].[ext]',
            },
          }
        ],
      },
    ],
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new webpack.DefinePlugin(env.stringified),
    new webpack.NormalModuleReplacementPlugin(
      /asyncLoader.js/,
      'syncLoader.js'
    ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    __dirname: true
  },
};
