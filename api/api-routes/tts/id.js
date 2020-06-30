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
          .then((hash2) => {
            res.json({
              status: 'OK',
              id: hash2,
              cache: false,
            });
          }).catch((err) => {
            console.log('err:', err);
            res.json({status: 'Error'});
          });
    } else {
      console.log('from cache, file', hash);
      res.json({
        status: 'OK',
        id: hash,
        cache: true,
      });
    }
  };

  post.apiDoc = {
    description: 'post text to generate speech file, return id',
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
      'application/json',
    ],
    responses: {
      200: {
        description: 'file id',
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
