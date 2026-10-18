const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const host = '127.0.0.1';
const port = Number(process.env.FX_DANCE_PORT || 4174);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png'
};

const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  const fromRoot = path.relative(root, file);
  if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(file, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
      return;
    }

    if (path.basename(file) === 'index.html') {
      const registration = '<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/app-icon-192.png"><meta name="theme-color" content="#171113"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><script>if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/service-worker.js").catch(console.error));</script>';
      content = Buffer.from(content.toString('utf8').replace('</head>', `${registration}</head>`));
    }

    response.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    });
    response.end(content);
  });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está ocupado. Cierra la otra instancia o configura FX_DANCE_PORT.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`FX Dance está listo: http://${host}:${port}`);
  console.log('Mantén esta ventana abierta mientras uses la app instalada.');
  console.log('En Microsoft Edge: menú ⋯ > Aplicaciones > Instalar este sitio como una aplicación.');
});
