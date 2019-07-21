
module.exports = () => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  function get(req, res) {
    console.log('request options variants');

    res.json({
      voice: {
        title: 'Голос',
        variants: [
          {
            title: 'Оксана',
            value: 'oksana',
          },
        ],
      },
      emotion: {
        title: 'Эмоция',
        variants: [
          {
            title: 'Доброжелательный',
            value: 'good',
          },
        ],
      },
      lang: {
        title: 'Язык',
        variants: [
          {
            title: 'Русский',
            value: 'ru-RU',
          },
        ],
      },
      format: {
        title: 'Формат',
        varaiants: [
          {
            title: 'Ogg Opus',
            value: 'oggopus',
          },
          {
            title: 'LPCM',
            value: 'lpcm',
          },
        ],
      },
    });
  }

  get.apiDoc = {
    description: 'get available options variants',
    tags: ['tts'],
    produces: [
      'application/json',
    ],
    responses: {
      200: {
        description: 'Request options variants',
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
    get: get,
  };
};
