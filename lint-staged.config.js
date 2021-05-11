const micromatch = require('micromatch')
const prettier = require('prettier')
const { ESLint } = require('eslint')
const filterAsync = require('node-filter-async').default
// const markdownlint = require('markdownlint-cli')

const eslintCli = new ESLint()

const removeIgnoredFiles = async (files) => {
  const filteredFiles = await filterAsync(files, async (file) => {
    console.log(file)
    // eslint version >= 7, isPathIgnored return promise, < 7 return boolean
    const isIgnored = await eslintCli.isPathIgnored(file)
    return !isIgnored
  })
  return filteredFiles.join(' ')
}

const prettierSupportedExtensions = prettier
  .getSupportInfo()
  .languages.map(({ extensions }) => extensions)
  .flat()
const addQuotes = (a) => `"${a}"`

module.exports = async (allStagedFiles) => {
  const shFiles = micromatch(allStagedFiles, ['**/src/**/*.sh'])
  if (shFiles.length) {
    return `printf '%s\n' "Script files aren't allowed in src directory" >&2`
  }

  const prettierFiles = micromatch(
    allStagedFiles,
    prettierSupportedExtensions.map((extension) => `**/*${extension}`)
  )

  const eslintFiles = micromatch(allStagedFiles, ['**/*.{ts,tsx,js,jsx}'])
  // 获取 eslintignore 中忽略后的文件
  const filesToLint = await removeIgnoredFiles(eslintFiles)

  const jsFiles = micromatch(filesToLint, ['**/*.js'])
  const docFiles = micromatch(allStagedFiles, ['**/*.md'])
  const tsFiles = micromatch(filesToLint, ['**/*.ts?(x)'])

  const config = [
    jsFiles.length > 10
      ? 'eslint --max-warnings=0 .'
      : `eslint --max-warnings=0 ${jsFiles.join(' ')}`,
    // docFiles.length > 10 ? 'mdl .' : `mdl ${docFiles.join(' ')}`, // mdl 是 ruby 那个
    // tsFiles.length > 0 ? 'tsc -p tsconfig.json --noEmit' : '',
    prettierFiles.length > 0
      ? `prettier --write ${prettierFiles.map(addQuotes).join(' ')}`
      : '',
  ]

  return config
}
