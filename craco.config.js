module.exports = {
  webpack: function (config, env) {
    const ignoreWarnings = [
      {
        module: /node_modules\/react-datepicker/,
        message: /Failed to parse source map/,
      },
    ];
    config.ignoreWarnings = ignoreWarnings;
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Redmine-API-Key,Content-Type,Accept',
      };
      config.setupMiddlewares = (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        return middlewares;
      };
      delete config.onBeforeSetupMiddleware;
      delete config.onAfterSetupMiddleware;
      return config;
    };
  },
};