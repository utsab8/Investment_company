const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy all /backend/* requests to PHP server
  app.use(
    '/backend',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/backend': '', // Remove /backend prefix when forwarding
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.url, 'to', 'http://localhost:8000' + req.url.replace('/backend', ''));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).send('Proxy error: ' + err.message);
      },
    })
  );
};

