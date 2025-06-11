const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/coingecko',
    createProxyMiddleware({
      target: 'https://api.coingecko.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/coingecko': '/api/v3'
      }
    })
  );
};