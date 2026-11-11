import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const outDir = '/tmp/preview-dist'
fs.rmSync(outDir, { recursive: true, force: true })

await build({
  configFile: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'bundle.js',
        assetFileNames: 'asset-[name][extname]',
      },
    },
  },
})

const files = fs.readdirSync(outDir)
const cssFile = files.find((f) => f.endsWith('.css'))
const jsFile = files.find((f) => f.endsWith('.js'))
if (!cssFile || !jsFile) {
  throw new Error(`Missing CSS/JS in ${outDir}: ${files.join(', ')}`)
}

const css = fs.readFileSync(path.join(outDir, cssFile), 'utf8')
const js = fs.readFileSync(path.join(outDir, jsFile), 'utf8')
const faviconB64 = fs.readFileSync('public/favicon.png').toString('base64')

const safeCss = css.replace(/<\/style/gi, '<\\/style')
const safeJs = js.replace(/<\/script/gi, '<\\/script')

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Partner Comunicação Integrada | Prévia Visual</title>
    <meta name="description" content="Comunicação integrada, branding, marketing digital, design e treinamentos para empresas." />
    <link rel="icon" type="image/png" href="data:image/png;base64,${faviconB64}" />
    <script>window.__PARTNER_STANDALONE_PREVIEW__ = true;</script>
    <style>${safeCss}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${safeJs}</script>
  </body>
</html>
`

fs.writeFileSync('preview.html', html, 'utf8')
console.log('Generated preview.html:', (Buffer.byteLength(html) / 1024).toFixed(1), 'KB')
