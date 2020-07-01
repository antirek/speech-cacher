const express = require('express');
const cors = require('cors');
const openapi = require('express-openapi');
const fileUpload = require('express-fileupload');
const checkApikey = require('check-auth-header');

const createApp = (api, config) => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(fileUpload());

  app.use(checkApikey({
    authKeys: config.apiKeys,
    authHeader: 'X-API-Key',
    excludes: ['/v1/api'],
  }));

  openapi.initialize({
    apiDoc: api.apiDoc, // require('./api-doc.js'),
    app: app,
    docsPath: '/api',
    paths: api.paths, // path.resolve(__dirname, 'api-routes'),
    dependencies: api.dependencies,
  });

  app.get('/', (req, res) => {
    res.send(api.description || '');
  });

  return app;
};

exports.createApp = createApp;
