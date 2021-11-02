const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      changeOrigin: true,
      target: 'http://backend:3566',
    }),
  );
  app.use(
    '/socket.io',
    createProxyMiddleware({
      changeOrigin: true,
      target: 'http://backend:3566',
      ws: true,
    }),
  );
};
