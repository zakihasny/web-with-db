import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'design-tokens/bgn.tokens.json')
const targets = [
  resolve(root, 'design-tokens/bgn.tokens.css'),
  resolve(root, 'assets/css/tokens.css')
]

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
const seen = new Set()

for (const token of source.tokens) {
  if (!token.css.startsWith('--')) throw new Error(`Invalid CSS variable for ${token.path}`)
  if (seen.has(token.css)) throw new Error(`Duplicate CSS variable: ${token.css}`)
  seen.add(token.css)
}

const css = [
  `/* Generated from design-tokens/bgn.tokens.json (BGN DS ${source.version}). Do not edit. */`,
  ':root {',
  ...source.tokens.map((token) => `  ${token.css}: ${token.value};`),
  '}',
  ''
].join('\n')

if (process.argv.includes('--check')) {
  for (const target of targets) {
    const current = await readFile(target, 'utf8').catch(() => '')
    if (current !== css) throw new Error(`${target} is not in sync. Run pnpm tokens:build.`)
  }
  console.log(`Verified ${source.tokens.length} BGN design tokens.`)
} else {
  for (const target of targets) await writeFile(target, css, 'utf8')
  console.log(`Generated ${source.tokens.length} BGN design tokens.`)
}
