import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const indexPath = join(distDir, 'index.html')
let html = readFileSync(indexPath, 'utf8')

const cssLinkPattern = /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/
const match = html.match(cssLinkPattern)

if (!match) {
  console.log('No app stylesheet link found in dist/index.html')
  process.exit(0)
}

const cssPath = join(distDir, match[1].replace(/^\//, ''))
const css = readFileSync(cssPath, 'utf8')
const styleTag = `<style data-inline-app-css>${css}</style>`

html = html.replace(cssLinkPattern, styleTag)
writeFileSync(indexPath, html, 'utf8')

console.log(`Inlined ${match[1]} into dist/index.html`)
