const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const { name } = require('../config')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 2224,
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/admin/**': {
        target: 'http://127.0.0.1:8082',
        // target: 'https://rain.cn.utools.club',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html/' + name + '.html',
      title: name,
    }),
  ],
})
