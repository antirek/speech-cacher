const fetch = require('node-fetch');
const createApp = require('../app').createApp;
const path = require('path');

const config = {
  cacheDir: '/tmp',
  yandexCloudApiKey: '111',
  apiKeys: ['1234'],
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
}, config);

describe('api tts', () => {
  it('get file from cache', (done) => {
    const server = app.listen(3000);
    cache.checkFile = jest.fn().mockReturnValue(true);

    fetch('http://localhost:3000/v1/tts/id', {
      method: 'post',
      body: JSON.stringify({
        text: 'hello world',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '1234',
      },
    })
        .then((res) => {
          expect(res.status).toBe(200);
          return res.json();
        })
        .then((json) => {
          console.log('json:', json);

          expect(json.cache).toEqual(true);
          expect(json.status).toEqual('OK');
        })
        .then(() => {
          server.close();
          done();
        });
  });

  it('get file from service ya tts', (done) => {
    const server = app.listen(3000);
    cache.checkFile = jest.fn().mockReturnValue(false);

    fetch('http://localhost:3000/v1/tts/id', {
      method: 'post',
      body: JSON.stringify({
        text: 'hello world',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '1234',
      },
    })
        .then((res) => {
          expect(res.status).toBe(200);
          return res.json();
        })
        .then((json) => {
          console.log('json:', json);

          expect(json.cache).toEqual(false);
          expect(json.status).toEqual('OK');
        })
        .then(() => {
          server.close();
          done();
        });
  });


  it('get file with options', (done) => {
    const server = app.listen(3000);
    cache.checkFile = jest.fn().mockReturnValue(true);

    fetch('http://localhost:3000/v1/tts/id', {
      method: 'post',
      body: JSON.stringify({
        text: 'hello world 2',
        voice: 'test_voice',
        emotion: 'test_emotion',
        lang: 'test_lang',
        speed: 'test_speed',
        format: 'test_format',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '1234',
      },
    })
        .then((res) => {
          expect(res.status).toBe(200);
          return res.json();
        })
        .then((json) => {
          console.log('json:', json);

          expect(json.cache).toEqual(true);
          expect(json.status).toEqual('OK');
          expect(json.id).toEqual('a9b9680326e5781552b97b051671d631');
        })
        .then(() => {
          server.close();
          done();
        });
  });

  it('get file with options', (done) => {
    const server = app.listen(3000);
    cache.getFilename = jest.fn().mockReturnValue(
        path.resolve(__dirname, './ttsSpec.js'));

    fetch('http://localhost:3000/v1/tts/34758493759834795', {
      headers: {
        'X-API-Key': '1234',
      },
    })
        .then((res) => {
          // console.log(res);
          expect(res.status).toBe(200);
        })
        .then(() => {
          server.close();
          done();
        });
  });
});
