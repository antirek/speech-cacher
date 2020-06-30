const fetch = require('node-fetch');
const qs = require('query-string');
const fs = require('fs');

/**
 *
 */
class YandexASR {
  /**
     *
     * @param {*} config
     * @param {*} cache
     */
  constructor(config, cache) {
    this.apiKey = config.apiKey;
    this.cache = cache;
  }

  /**
   *
   * @param {*} filename
   * @param {*} options
   * @return {Promise}
   */
  recognize(filename, options = {}) {
    if (!filename) {
      return Promise.reject(new Error('no filename for recognize'));
    }
    console.log('ya asr start recognize');

    const readStream = fs.createReadStream(filename);

    const params = {
      lang: 'ru-RU',
      topic: 'general',
      profanityFilter: true,
      format: 'oggopus',
    };

    const queryParams = qs.stringify(params);
    const url = 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?' +
        queryParams;
    console.log('url', url);

    return fetch(url, {
      method: 'post',
      body: readStream,
      headers: {
        'Transfer-Encoding': 'chunked',
        'Authorization': 'Api-Key ' + this.apiKey,
      },
    })
        .then((res) => {
          console.log('response status:', res.status);
          if (res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res);
          }
        })
        .then((json) => {
          console.log('json', json);
          return json;
        });
  }
}

module.exports = YandexASR;
