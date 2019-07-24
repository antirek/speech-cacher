const fs = require('fs');

module.exports = (cache) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  function get(req, res) {
    console.log('request file id');
    console.log('request params:', req.params);

    const id = req.params.id;
    console.log('id:', id);

    const filename = cache.getFilename(id);

    try {
      const result = fs.readFileSync(filename + '.txt', 'utf8');
      res.send(result);
    } catch (err) {
      console.log('err:', err);
      res.status(400).send();
    }
  }

  get.apiDoc = {
    description: 'get recognized text by id',
    tags: ['asr'],
    produces: [
      'application/json',
    ],
    responses: {
      200: {
        description: 'Requested text',
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
    parameters: [
      {
        name: 'id',
        in: 'path',
        type: 'string',
        required: true,
        description: 'text id',
      },
    ],
    get: get,
  };
};
