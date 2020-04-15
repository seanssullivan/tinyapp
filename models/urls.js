// models/urls.js

// Node Imports
const fs = require('fs');

// Local Imports
const cachedURLs = require('../cache/urls.json') || {};
const { generateRandomString } = require('../services');

class Urls {
  constructor() {
    this._urls = cachedURLs;
  }

  /**
   * Returns the long URL for a given short URL.
   * @param {string} shortURL 
   */
  getLongURL(shortURL) {
    return this._urls[shortURL].longURL;
  }

  /**
   * Returns the ID for the user who owns a given short URL.
   * @param {string} shortURL 
   */
  getUserID(shortURL) {
    return this._urls[shortURL].userID;
  }

  /**
   * Returns all urls owned by user.
   * @param {string} userID 
   */
  urlsForUser(userID) {
    return Object.values(this._urls).filter(url => url.userID === userID);
  }

  /**
   * Creates a new short URL.
   * @param {string} longURL 
   * @param {string} userID 
   */
  addURL(longURL, userID) {
    const shortURL = generateRandomString(6);
    const urlData = {
      shortURL,
      longURL,
      userID
    }
    this._urls[shortURL] = urlData;
    this.writeToCache();

    return shortURL;
  }

  /**
   * Updates a saved URL.
   * @param {string} shortURL 
   * @param {string} longURL 
   * @param {string} userID 
   */
  updateURL(shortURL, longURL, userID) {
    if (this.getUserID(shortURL) !== userID) {
      return false;
    } else {
      this._urls[shortURL].longURL = longURL;
      this.writeToCache();
      return true;
    }
  }

  /**
   * Writes URL data to JSON cache file.
   */
  writeToCache() {
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

module.exports = Urls;
