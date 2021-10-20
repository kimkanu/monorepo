import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

export default function setupProxy(
  app: { use: (path: string, middleware: RequestHandler) => void; },
) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://[::1]:3567',
      changeOrigin: true,
    }),
  );
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://[::1]:3567',
      changeOrigin: true,
      ws: true,
    }),
  );
}
