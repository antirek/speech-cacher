
module.exports = () => {
  /**
      *
      * @param {Object} req
      * @param {Object} res
      */
  function get(req, res) {
    console.log('request options variants');

    res.json({
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
      topic: {
        title: 'Языковая модель',
        varaiants: [
          {
            title: 'Короткие запросы',
            value: 'general',
          },
          {
            title: 'Адреса',
            value: 'maps',
          },
        ],
      },
      profanityFilter: {
        title: 'Фильтр ненормативной лексики',
        varaiants: [
          {
            title: 'Включен',
            value: 'true',
          },
          {
            title: 'Выключен',
            value: 'false',
          },
        ],
      },
    });
  }

  get.apiDoc = {
    description: 'get available ASR options variants',
    tags: ['asr'],
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
