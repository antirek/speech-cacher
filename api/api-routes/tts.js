module.exports = (yaTTS, cache) => {

  /** 
  *
  * @param {Object} req
  * @param {Object} res
  */
  const post = (req, res) => {
    console.log('request params', req.params);
    console.log('request body:', req.body);

    const text = req.body.text;
    console.log('text for generate', text);

    const options = {}
    
    const params = {
      text: text,
      voice: options.voice || 'zahar',
      emotion: options.emotion || 'good',
      lang: options.lang || 'ru-RU',
      speed: options.speed || '1.0',
      format: options.format ||  'oggopus',
    }

    const hash = cache.getHash(params);

    if (!cache.checkFile(hash)) {
      console.log('no in cache, generate')
      yaTTS.generate(text)
        .then(() => {
          res.json({
            status: 'OK', 
            id: hash,
            cache: false,
          });
      }).catch(err => {
        console.log('err:', err);
        res.json({status: 'Error'})
      })
    } else {
      console.log('from cache')
      res.json({
        status: 'OK', 
        id: hash,
        cache: true,
      });
    }
  };

  post.apiDoc = {
    description: 'post text to generate speech file',
    tags: ['tts'],
    parameters: [
      {
        name: 'text',
        in: 'body',
        schema: {
          $ref: '#/definitions/Text',
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
