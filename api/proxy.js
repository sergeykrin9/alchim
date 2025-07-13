const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors()); // Включаем CORS для всех запросов к нашему прокси

// Настраиваем прокси для всех запросов, идущих на /
app.use('/', createProxyMiddleware({
  target: 'https://api.netlify.com', // Целевой сервер, куда перенаправляем запросы
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Убираем начальный слеш, чтобы правильно сформировать URL
    return path.substring(1);
  },
  onProxyReq: (proxyReq, req, res) => {
    // Устанавливаем правильный хост в заголовках
    proxyReq.setHeader('host', 'api.netlify.com');
  }
}));

// Экспортируем приложение для Vercel
module.exports = app;
