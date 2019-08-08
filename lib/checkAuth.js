module.exports = ({
  apiKeys = [],
  authHeader = 'X-API-KEY',
  excludes = [],
  debug = false,
}) => {
  const log = (m1, m2 = '') => {
    if (debug) console.log(m1, m2);
  };

  return (req, res, next) => {
    const apiKeyValue = req.get(authHeader);
    log('req.path', req.path);

    if (excludes.indexOf(req.path) !== -1) {
      log('auth not required');
      return next();
    }

    if (apiKeys && apiKeys.length != 0 && apiKeys.indexOf(apiKeyValue) === -1) {
      log('Invalid api_key:', apiKeyValue);
      res.status(401).send({
        error: 'Invalid API auth key',
        authHeader,
      });
    } else {
      log('auth verified good', apiKeyValue);
      return next();
    }
  };
};
