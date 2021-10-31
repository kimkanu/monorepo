const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend:3566',
      changeOrigin: true,
    }),
  );
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://backend:3566',
      changeOrigin: true,
      ws: true,
    }),
  );
};
