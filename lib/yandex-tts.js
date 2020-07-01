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
    this.ttsUrl = config.ttsUrl || 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';
    this.apiKey = config.apiKey;
    this.textLengthMax = Number(config.textLengthMax) || 5000;
    this.cache = cache;
  }

  /**
   *
   * @param {*} text
   * @param {*} options
   * @return {*}
   */
  prepareParams(text, options = {}) {
    if (!text) {
      return Promise.reject(new Error('no text for generate'));
    }
    if (text.length > this.textLengthMax) {
      console.log('text was trimed to', this.textLengthMax, 'symbols');
      text = text.substring(0, this.textLengthMax);
    }
    const params = {
      text,
      voice: options.voice || 'zahar',
      emotion: options.emotion || 'good',
      lang: options.lang || 'ru-RU',
      speed: options.speed || '1.0',
      format: options.format || 'oggopus',
    };

    return params;
  }

  /**
   *
   * @param {*} text
   * @param {*} options
   * @return {Promise}
   */
  async generate(text, options = {}) {
    console.log('ya tts start generate');
    const params = this.prepareParams(text, options);

    console.log('ya tts params', params);
    const hash = this.cache.getHash(params);

    const requestParams = new URLSearchParams();

    requestParams.append('text', params.text);
    requestParams.append('voice', params.voice);
    requestParams.append('emotion', params.emotion);
    requestParams.append('lang', params.lang);
    requestParams.append('speed', params.speed);
    requestParams.append('format', params.format);

    const res = await fetch(this.ttsUrl, {
      method: 'post',
      body: requestParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Api-Key ' + this.apiKey,
      },
    });
    console.log('response status:', res.status);

    return new Promise((resolve, reject) => {
      if (res.status === 200) {
        const dest = this.cache.getDestinationFileStream(hash);
        res.body.pipe(dest);
        dest.on('finish', () => {
          dest.close();
          console.log('write file', hash);
          resolve(hash);
        });
      } else {
        res.json()
            .then((resJson) => {
              console.log('res json', resJson);
              reject(
                  new Error(resJson.error_code + ' ' +
                    resJson.error_message),
              );
            });
      }
    });
  }
}

module.exports = YandexTTS;
