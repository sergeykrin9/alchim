// api/proxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

// Vercel автоматически обработает этот экспорт как серверный эндпоинт.
// Это более современный и правильный способ для Vercel, чем использование express.
module.exports = (req, res) => {
  // Удаляем префикс /api из URL, если он есть, чтобы правильно перенаправить запрос
  // Например, /api/sites -> /sites
  req.url = req.url.replace(/^\/api/, '');

  createProxyMiddleware({
    target: 'https://api.netlify.com/v1', // Целевой API Netlify
    changeOrigin: true,
    pathRewrite: {
      // Это правило гарантирует, что путь будет правильно передан.
      // Например, запрос на /sites станет запросом к https://api.netlify.com/v1/sites
    },
    onProxyReq: (proxyReq, req, res) => {
      // Убеждаемся, что заголовки правильно передаются
      proxyReq.setHeader('Host', 'api.netlify.com');
    },
    onError: (err, req, res) => {
      console.error('Proxy Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Something went wrong. And we are reporting a custom error message.');
    }
  })(req, res);
};
