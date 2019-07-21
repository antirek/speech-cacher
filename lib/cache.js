
const md5 = require('md5');
const fs = require('fs');
const path = require('path');

class Cache {
    constructor (options) {
        this.cacheDir = options.cacheDir;
    }
    
    getHash (options) {
        return md5(JSON.stringify(options));
    }

    checkFile (hash) {
        const filename = this.getFilename(hash);
        return fs.existsSync(filename);
    }

    getFilename (hash) {
        return path.resolve(this.cacheDir, hash + '.ogg');
    }

    getDestinationFileStream (hash) {
        const filename = this.getFilename(hash);        
        return fs.createWriteStream(filename);
    }
}

module.exports = Cache;