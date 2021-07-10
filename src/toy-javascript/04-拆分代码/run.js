import { Evaluator } from './evaluator'

import { parse } from './SyntaxParser'

document.getElementById('run').addEventListener('click', () => {
  const { value } = document.getElementById('source')
  const evaluator = new Evaluator()
  const r = evaluator.evaluate(parse(value))
  console.log(r)
})
