const fetch = require('node-fetch');
const {URLSearchParams} = require('url');

/**
 *
 */
class YandexTTS {
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
   * @param {*} text
   * @param {*} options
   * @return {Promise}
   */
  generate(text, options = {}) {
    if (!text) {
      return Promise.reject(new Error('no text for generate'));
    }
    console.log('ya tts start generate');
    const params = {
      text: text,
      voice: options.voice || 'zahar',
      emotion: options.emotion || 'good',
      lang: options.lang || 'ru-RU',
      speed: options.speed || '1.0',
      format: options.format || 'oggopus',
    };

    console.log('ya tts params', params);
    const hash = this.cache.getHash(params);

    const requestParams = new URLSearchParams();

    requestParams.append('text', params.text);
    requestParams.append('voice', params.voice);
    requestParams.append('emotion', params.emotion);
    requestParams.append('lang', params.lang);
    requestParams.append('speed', params.speed);
    requestParams.append('format', params.format);

    return fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
      method: 'post',
      body: requestParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Api-Key ' + this.apiKey,
      },
    })
        .then((res) => {
          console.log('response status:', res.status);

          if (res.status === 200) {
            const dest = this.cache.getDestinationFileStream(hash);
            res.body.pipe(dest);
            console.log('write file', hash);
            return hash;
          } else {
            return res.json()
                .then((resJson) => {
                  console.log('res json', resJson);
                  return Promise.reject(
                      new Error(resJson.error_code + ' ' +
                        resJson.error_message)
                  );
                });
          }
        });
  }
}

module.exports = YandexTTS;
