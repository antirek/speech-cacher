const Cache = require('../lib/cache');
const YandexTTS = require('../lib/yandex-tts');

const config = {
  cacheDir: '/tmp',
  yandexCloudApiKey: '111',
  apiKeys: ['1234'],
};


const cache = new Cache({
  cacheDir: config.cacheDir,
});

const yaTTS = new YandexTTS({
  apiKey: config.yandexCloudApiKey,
}, cache);

const goodParams = {
  text: 'tetetet',
  voice: 'oksana',
  emotion: 'good',
  lang: 'ru-RU',
  speed: '1.0',
  format: 'ogg',
};

describe('api tts', () => {
  it('get file from cache', (done) => {
    const params = yaTTS.prepareParams('tetetet', {
      format: 'ogg',
      voice: 'oksana',
    });

    expect(params).toEqual(goodParams);
    console.log('params', params);
    done();
  });
});
