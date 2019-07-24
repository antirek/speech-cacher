const fs = require('fs');

module.exports = (yaASR, cache) => {
  /**
  *
  * @param {Object} req
  * @param {Object} res
  */
  const post = (req, res) => {
    console.log('request query', req.query);
    console.log('request params', req.params);
    console.log('request body:', req.body);
    console.log('request files:', req.files);

    const params = {
      lang: req.body.lang || 'ru-RU',
      format: req.query.format || 'oggopus',
      topic: req.query.topic || 'general',
      profanityFilter: req.query.profanityFilter || true,
    };

    console.log('params', params);

    if (!req.files.upfile) {
      res.status(400).send('No file was uploaded.');
      return;
    }

    const upfile = req.files.upfile;
    const filename = cache.getFilename(upfile.md5);

    res.send({
      status: 'OK',
      hash: upfile.md5,
    });

    upfile.mv(filename, (err) => {
      if (err) {
        console.log('err:', err);
        return res.status(500).send();
      }

      yaASR.recognize(filename)
          .then((result) => {
            // console.log('end recognize', result);
            fs.appendFileSync(filename + '.txt', JSON.stringify(result));
          });
    });
  };

  post.apiDoc = {
    description: 'post speech file to get text, return id',
    tags: ['asr'],
    consumes: [
      'multipart/form-data',
    ],
    parameters: [
      {
        in: 'query',
        name: 'lang',
        type: 'string',
        description: 'ru-RU',
      },
      {
        in: 'query',
        name: 'topic',
        type: 'string',
        description: 'general',
      },
      {
        in: 'query',
        name: 'profanityFilter',
        type: 'string',
        description: 'true',
      },
      {
        in: 'query',
        name: 'format',
        type: 'string',
        description: 'oggopus',
      },
      {
        name: 'upfile',
        in: 'formData',
        type: 'file',
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
