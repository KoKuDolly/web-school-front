const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const { names } = require('../config')

// const hwp = []

// names.forEach(name => {
//   hwp.push(new HtmlWebpackPlugin({
//     template: 'html/' + name + '.html',
//     title: name,
//   }))
// })

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
    // ...hwp
    new HtmlWebpackPlugin({
      template: 'html/' + names[1] + '.html',
      title: names[1],
    }),
  ],
})
