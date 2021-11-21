/* istanbul ignore file */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      changeOrigin: true,
      target: process.env.REACT_APP_PROXY_URL,
    }),
  );
  app.use(
    '/socket.io',
    createProxyMiddleware({
      changeOrigin: true,
      target: process.env.REACT_APP_PROXY_URL,
      ws: true,
    }),
  );
};
