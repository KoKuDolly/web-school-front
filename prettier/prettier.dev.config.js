const prettier = require('prettier')
const path = require('path')
const fs = require('fs')

// prettier.format('', {
//   filepath: '/src/**.js',
//   printWidth: 120,
//   tabWidth: 2,
//   useTabs: false,
//   semi: false,
//   singleQuote: true,
//   quoteProps: 'as-needed',
//   jsxSingleQuote: false,
//   trailingComma: 'es5',
//   bracketSpacing: true,
//   jsxBracketSameLine: false,
//   arrowParens: 'always',
//   rangeStart: 0,
//   rangeEnd: Infinity,
//   requirePragma: false,
//   insertPragma: false,
//   'prose-wrap': 'preserve',
//   htmlWhitespaceSensitivity: 'css',
//   vueIndentScriptAndStyle: false,
//   endOfLine: 'lf',
//   embeddedLanguageFormatting: 'auto',
// })

const filePath = path.resolve(__dirname, '../src/index.js')

prettier
  .resolveConfig(filePath, { editorconfig: false, useCache: false })
  .then((options) => {
    const entry = path.resolve(__dirname, '../src')
    function formatter(paths) {
      fs.readdir(paths, { withFileTypes: true }, (err, filesNames) => {
        if (err) return
        filesNames.forEach((fileName) => {
          const _path = path.resolve(paths, fileName.name)
          fs.stat(_path, function (err, stats) {
            if (err) return
            if (stats.isFile()) {
              const text = fs.readFileSync(_path, 'utf8')
              const formatted = prettier.format(text, {
                ...options,
                filepath: fileName.name,
              })
              fs.writeFileSync(_path, formatted, { encoding: 'utf8' })
            } else {
              formatter(_path)
            }
          })
        })
      })
    }

    formatter(entry)
  })
