module.exports = ({apiKeys, authHeader}) => {
  return (req, res, next) => {
    const apiKeyValue = req.get(authHeader);
    if (apiKeys && apiKeys.length != 0 && apiKeys.indexOf(apiKeyValue) == -1) {
      console.log('Invalid api_key: ' + apiKeyValue);
      res.status(401).send({
        error: 'Invalid API auth key',
        authHeader,
      });
    } else {
      console.log('auth verified good', apiKeyValue);
      return next();
    }
  };
};
