const config = require('config');
const path = require('path');

const createApp = require('./app').createApp;

const Cache = require('./lib/cache');
const cache = new Cache({
  cacheDir: config.cacheDir,
});

const YandexTTS = require('./lib/yandex-tts');
const yaTTS = new YandexTTS({
  apiKey: config.yandexCloudApiKey,
}, cache);

const app = createApp({
  desciption: 'Speech API',
  apiDoc: require('./api/api-doc.js'),
  paths: path.resolve(__dirname, 'api/api-routes'),
  dependencies: {
    yaTTS,
    cache,
  },
});

app.listen(config.port, () => {
  console.log('started at ', config.port);
});
