'use strict'

const path = require("path")
const webpack = require("webpack")
const paths = require('./paths')
const pkg = require("../../package.json")
const vendorPackages = Object.keys(pkg.dependencies)

module.exports = {
  entry: {
    vendor: vendorPackages
  },
  output: {
    path: path.join(paths.appBuild, '/static/scripts'),
    filename: '[name].[hash:6].js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
