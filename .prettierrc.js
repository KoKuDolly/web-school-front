module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  overrides: [],
}

// or 这个包要发布到npm上或者公司的私有服务器上，并在项目进行安装
// module.exports = '@company/prettier-config'

// 这样可以实现公用，也能进行个性化覆盖和重写
// module.exports = {
//   ...require('@company/prettier-config'),
//   semi: false,
// }

// overrides 和 parser 的配合
// 可以告诉prettier 如何解析不认识的扩展文件
// top level 绝对不要对parser进行指定，只在override里对指定文件进行parser指定

// or 使用这个配置，里面包含了 JSON Schema
// https://github.com/azz/prettier-config

// 不论是 pretter 还是 eslint 的配置文件，搜索机制是依赖一个包实现的 => cosmiconfig
// https://github.com/davidtheclark/cosmiconfig

// vscode webstorm vim 推荐 使用 插件 搭配 config 文件
// 假如 编辑器不支持 prettier， 那么 可以使用 onchange 来监听项目文件，实时调用 prettier 来 美化代码。
