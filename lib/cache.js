
const md5 = require('md5');
const fs = require('fs');
const path = require('path');

/**
 *
 */
class Cache {
  /**
   *
   * @param {*} options
   */
  constructor(options) {
    this.cacheDir = options.cacheDir;
  }

  /**
   *
   * @param {*} options
   * @return {string}
   */
  getHash(options) {
    return md5(JSON.stringify(options));
  }

  /**
   *
   * @param {*} hash
   * @return {boolean}
   */
  checkFile(hash) {
    const filename = this.getFilename(hash);
    return fs.existsSync(filename);
  }

  /**
   *
   * @param {*} hash
   * @return {string}
   */
  getFilename(hash) {
    return path.resolve(this.cacheDir, hash + '.ogg');
  }

  /**
   *
   * @param {*} hash
   * @return {Object}
   */
  getDestinationFileStream(hash) {
    const filename = this.getFilename(hash);
    return fs.createWriteStream(filename);
  }
}

module.exports = Cache;
