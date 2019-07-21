
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
    res.sendFile(filename);
  }

  get.apiDoc = {
    description: 'get generated file by id',
    tags: ['tts'],
    produces: [
      'audio/ogg',
    ],
    responses: {
      200: {
        description: 'Requested file',
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
        description: 'file id',
      },
    ],
    get: get,
  };
};
