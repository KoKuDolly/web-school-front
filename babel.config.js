module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: 9,
        },
        useBuiltIns: 'usage',
        corejs: '3.6.4',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
      },
    ],
  ]
  const plugins = [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css', // `style: true` 会加载 less 文件
      },
    ],
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-transform-react-display-name',
    // '@babel/plugin-transform-react-jsx-self',
    // '@babel/plugin-transform-react-jsx-source'
  ]

  return {
    presets,
    plugins,
  }
}
