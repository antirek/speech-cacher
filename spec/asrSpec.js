const fetch = require('node-fetch');
const createApp = require('../app').createApp;
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');

const config = {
  cacheDir: '/tmp',
  yandexCloudApiKey: '111',
};

const Cache = require('../lib/cache');
const cache = new Cache({
  cacheDir: config.cacheDir,
});

const YandexTTS = require('../lib/yandex-tts');
const yaTTS = new YandexTTS({
  apiKey: config.yandexCloudApiKey,
}, cache);

const YandexASR = require('../lib/yandex-asr');
const yaASR = new YandexASR({
  apiKey: config.yandexCloudApiKey,
}, cache);

yaASR.recognize = jest.fn().mockReturnValue(Promise.resolve());
yaTTS.generate = jest.fn().mockReturnValue(Promise.resolve());

const app = createApp({
  desciption: 'Speech API',
  apiDoc: require('../api/api-doc.js'),
  paths: path.resolve(__dirname, './../api/api-routes'),
  dependencies: {
    yaTTS,
    cache,
    yaASR,
  },
});

describe('api asr', () => {
  it('post speech file', (done) => {
    const server = app.listen(3000);

    const formData = new FormData();
    const r = fs.readFileSync(__dirname + '/speech.ogg');
    // console.log('r', __dirname, r);
    formData.append('upfile', r, {
      contentType: 'audio/ogg',
      filename: 'speech.ogg',
    });

    fetch('http://localhost:3000/v1/asr/id', {
      method: 'post',
      body: formData,

    })
        .then((res) => {
          expect(res.status).toBe(200);
          return res.json();
        })
        .then((json) => {
          console.log('json:', json);
          expect(json.status).toEqual('OK');
        })
        .then(() => {
          server.close();
          done();
        });
  });
});
