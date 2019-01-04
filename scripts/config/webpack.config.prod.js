'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
/*const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;*/
const pxtorem = require('postcss-pxtorem');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/styles/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ?
  {publicPath: Array(cssFilename.split('/').length).join('../')}
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
          // modules: true,
          localIdentName: '[local]__[hash:base64:5]',
          sourceMap: shouldUseSourceMap
        }
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
              flexbox: 'no-2009'
            }),
            pxtorem({
              rootValue: 37.5,
              propList: ['*', '!font', '!font-size',],
              selectorBlackList: [/^html$/]
            })
          ]
        }
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
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: {
    app: [
      require.resolve('./polyfills'),
      paths.appClient
    ]
  },
  output: {
    path: paths.appBuild,
    filename: 'static/scripts/[name].[chunkhash:8].js',
    chunkFilename: 'static/scripts/[name].[chunkhash:8].js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ]
  },
  cache: true,
  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM || window.React',
    'reflux': 'window.Reflux',
    'saltui': 'window.SaltUI',
    'react-router': 'window.ReactRouter',
    'jquery': 'window.jQuery || window.Zepto',
    'dd': 'window.dd',
    'echarts': 'window.echarts'
  },
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
        include: paths.appSrc
      },
      {
        oneOf: [
          {
            test: /\.(png|jpe?g|gif|bmp|webp)(\?.*)?$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/images/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/fonts/[name].[hash:8].[ext]',
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
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true
            }
          },
          {
            test: /\.css$/,
            loader: extractCSSFromLoader()
          },
          {
            test: /\.(sass|scss)$/,
            loader: extractCSSFromLoader('sass-loader')
          },
          {
            test: /\.less$/,
            loader: extractCSSFromLoader('less-loader')
          },
          {
            test: /\.(stylus|styl)$/,
            loader: extractCSSFromLoader('stylus-loader')
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/, /\.less$/, /\.styl$/],
            options: {
              name: 'static/images/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'async',
      children: true,
      minChunks: (module, count) => (
        count >= 2
      )
    }),
    new webpack.DefinePlugin(env.stringified),
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
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: Object.assign(
        {
          safe: true,
          map: { inline: false },
          discardComments: { removeAll: true }
        },
        shouldUseSourceMap ?
          {
            map: { inline: false }
          }
          :
          {}
        )
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          return;
        }
        console.log(message);
      },
      minify: true,
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // == PRERENDER SPA PLUGIN == //
    /*new PrerenderSPAPlugin({
      // Index.html is in the root directory.
      staticDir: paths.appBuild,
      routes: [ '/' ],
      // Optional minification.
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true
      },

      renderer: new Renderer({
        renderAfterTime: 500
      })
    })*/
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
