// models/data.js

// Node Imports
const fs = require('fs');

class DataFile {
  constructor() {
    this._users = {};
    this._loadJSONData('../cache/urls.json');
  }

  _loadJSONData(filePath) {
    return new Promise((resolve, reject) => {
      this._readJSONFile(filePath, resolve, reject);
    })
    .then((data) => {
      this._users = JSON.parse(data);
    })
    .catch((err) => {
      if (err = "ENOENT") {
        this._readJSONFile(filePath);
      } else {
        throw err;
      }
    })
  }

  _readJSONFile(filePath, resolve, reject) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }

  _createJSONFile(filePath) {
    fs.writeFile(filePath, {}, (err) => {
      if (err) throw err;
    })
  }

  /**
   * Writes URL data to JSON cache file.
   */
  _writeToCache() {
    const urlData = JSON.stringify(this._urls, null, 2);
    fs.writeFile('cache/urls.json', urlData, (err) => {
      if (err) {
        console.log('Could not write URLs to cache:', err);
      } else {
        console.log('URLs successfully written to cache.');
      }
    });
  }
}