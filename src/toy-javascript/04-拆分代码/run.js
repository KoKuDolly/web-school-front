import { Evaluator } from './evaluator.js'

import { parse } from './SyntaxParser.js'

document.getElementById('run').addEventListener('click', () => {
  const { value } = document.getElementById('source')
  const evaluator = new Evaluator()
  const r = evaluator.evaluate(parse(value))
  console.log(r)
})
