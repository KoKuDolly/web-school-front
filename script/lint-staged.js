const path = require('path')
const lintStaged = require('lint-staged')

// console.log(process.cwd(), __dirname)
const cwd = process.cwd()

async function lintStagedWrapper() {
  try {
    const success = await lintStaged({
      allowEmpty: false,
      concurrent: true,
      configPath: path.resolve(cwd, 'lint-staged.config.js'),
      cwd,
      debug: false,
      maxArgLength: null,
      quiet: false,
      relative: false,
      shell: false,
      stash: true,
      verbose: false,
    })
    console.log(success ? 'Linting was successful!' : 'Linting failed!')
  } catch (e) {
    // Failed to load configuration
    console.error(e)
  }
}

module.exports = lintStagedWrapper()
