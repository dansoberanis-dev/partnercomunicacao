import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const outDir = '/tmp/static-site-dist'
fs.rmSync(outDir, { recursive: true, force: true })

await build({
  configFile: false,
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || assetInfo.name || 'asset'
          if (name.endsWith('.css')) return 'assets/style.css'
          return 'assets/[name][extname]'
        },
      },
    },
  },
})

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Partner Comunicação Integrada | Agência de Comunicação e Marketing</title>
    <meta
      name="description"
      content="Comunicação integrada, branding, marketing digital, design e treinamentos para empresas. Uma mensagem única em todos os canais. Agende um diagnóstico gratuito."
    />
    <meta name="author" content="Partner Comunicação Integrada" />
    <meta name="theme-color" content="#2E4859" />
    <meta property="og:site_name" content="Partner Comunicação Integrada" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Partner Comunicação Integrada | Agência de Comunicação e Marketing" />
    <meta
      property="og:description"
      content="Comunicação integrada, branding, marketing digital, design e treinamentos para empresas. Uma mensagem única em todos os canais. Agende um diagnóstico gratuito."
    />
    <meta property="og:image" content="./og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="./og-image.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Sora:wght@600;800&display=swap"
    />
    <link rel="icon" type="image/png" sizes="64x64" href="./favicon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="./icon-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
    <link rel="stylesheet" href="./assets/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./assets/app.js"></script>
  </body>
</html>
`

fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')

const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`
fs.writeFileSync(path.join(outDir, '.htaccess'), htaccess, 'utf8')
