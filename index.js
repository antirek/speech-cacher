#!/usr/bin/env node

const config = require('config');
const path = require('path');

const allApiKeysIsUUID = require('./lib/checkUUID').allApiKeysIsUUID;

if (!allApiKeysIsUUID(config.apiKeys)) {
  console.log('not all apiKeys is UUID format');
  process.exit(1);
}

const createApp = require('./app').createApp;

const Cache = require('./lib/cache');
const cache = new Cache({
  cacheDir: config.cacheDir,
});

const YandexTTS = require('./lib/yandex-tts');
const yaTTS = new YandexTTS({
  apiKey: config.yandexCloudApiKey,
}, cache);

const YandexASR = require('./lib/yandex-asr');
const yaASR = new YandexASR({
  apiKey: config.yandexCloudApiKey,
}, cache);


const app = createApp({
  desciption: 'Speech API',
  apiDoc: require('./api/api-doc.js'),
  paths: path.resolve(__dirname, 'api/api-routes'),
  dependencies: {
    yaTTS,
    yaASR,
    cache,
  },
}, config);

app.listen(config.port, () => {
  console.log('started at', config.port, 'with', config);
});
