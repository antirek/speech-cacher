// const fs = require('fs');

module.exports = (yaTTS, cache) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  const post = (req, res) => {
    console.log('request params', req.params);
    console.log('request body:', req.body);

    const text = (req.body.text).toString().toLowerCase();
    console.log('text for generate', text);
    console.log('voice', req.body.voice);

    const params = {
      text: text,
      voice: req.body.voice || 'zahar',
      emotion: req.body.emotion || 'good',
      lang: req.body.lang || 'ru-RU',
      speed: req.body.speed || '1.0',
      format: req.body.format || 'oggopus',
    };

    const hash = cache.getHash(params);

    if (!cache.checkFile(hash)) {
      console.log('no in cache, generate');
      yaTTS.generate(text, params)
          .then(() => {
            console.log(' --- after generate --- ');
            const filename = cache.getFilename(hash);
            console.log('filename', filename);
            res.setHeader('Content-type', 'audio/ogg');
            res.download(filename);
          }).catch((err) => {
            console.log('err:', err);
            res.json({status: 'Error'});
          });
    } else {
      console.log('from cache, file', hash);
      const filename = cache.getFilename(hash);
      res.setHeader('Content-type', 'audio/ogg');
      res.download(filename);
    }
  };

  post.apiDoc = {
    description: 'post text to generate speech file, return file',
    tags: ['tts'],
    parameters: [
      {
        name: 'text',
        in: 'body',
        schema: {
          $ref: '#/definitions/TextToSpeech',
        },
        required: true,
        description: 'text for speech synthesis',
      },
    ],
    produces: [
      'audio/ogg',
    ],
    responses: {
      200: {
        description: 'audio file',
      },
      default: {
        description: 'Unexpected error',
        schema: {
          $ref: '#/definitions/Error',
        },
      },
    },
  };

  return {
    post,
  };
};
