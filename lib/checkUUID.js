const isuuid = require('isuuid');

const allApiKeysIsUUID = (apiKeys) => {
  const res = apiKeys.find((key) => {
    return !isuuid(key);
  });
  return res ? false : true;
};

module.exports = {
  allApiKeysIsUUID,
};
