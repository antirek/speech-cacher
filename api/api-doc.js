module.exports = {
  swagger: '2.0',
  basePath: '/v1',
  schemes: ['http'],
  info: {
    title: 'speech api',
    version: '1.0.0',
  },
  definitions: {
    Error: {
      additionalProperties: true,
    },
    Text: {
      type: 'object',
      properties: {
        text: {
          type: 'string',          
        }
      },
      example: {
        text: "hello world"
      },
      additionalProperties: true,
    }
  },
  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {},
};
