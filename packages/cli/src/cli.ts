import { writeFileSync } from 'fs'
import { promisify } from 'util'
import path from 'path'
import { homedir } from 'os'

import _mkdirp from 'mkdirp'
import { ts } from 'ts-simple-ast'

import extractFunctions from './extract'

const mkdirp = promisify(_mkdirp)

const fileNames = process.argv.slice(2)

const results = extractFunctions(fileNames, {
  compilerOptions: {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  },
})

const $home = homedir()
const dir = path.join($home, '.ts-earch')

mkdirp(dir)
  .then(() => {
    const filePath = path.join(dir, 'types.json')

    writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8')

    console.log(`Types writen ${filePath}`)
  })
  .catch(err => {
    console.error(err)
  })
