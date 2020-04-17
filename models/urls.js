// models/urls.js

// Node Imports
const fs = require('fs');

// Local Imports
const { generateRandomString } = require('../services');

class Urls {
  constructor(urlsData, disableCache = false) {
    this._urls = urlsData;
    this._disableCache = disableCache;
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
      userID,
      clicks: {}
    };
    this._urls[shortURL] = urlData;
    this.writeToCache();
    return urlData;
  }

  /**
   * Returns a url object for a provided shortURL.
   * @param {string} shortURL 
   */
  getURL(shortURL) {
    const url = this._urls[shortURL];
    return Object.assign({}, {
      totalClicks: this.totalClicks(url.shortURL),
      uniqueClicks: this.uniqueClicks(url.shortURL),
      ...url
    });
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
   * Increments the click count for a url.
   * @param {string} shortURL 
   * @param {string} clickID 
   */
  incrementClicks(shortURL, clickID) {
    const url = this._urls[shortURL]
    if (!url.clicks[clickID]) {
      url.clicks[clickID] = 1;
    } else {
      url.clicks[clickID]++;
    }
    this.writeToCache();
  }

  /**
   * Calculates the total number of clicks for a url.
   * @param {string} shortURL 
   */
  totalClicks(shortURL) {
    const url = this._urls[shortURL];
    const clickCount = Object.values(url.clicks).reduce((total, curr) => total + curr, 0)
    return clickCount;
  }

  /**
   * Calculates the total number of unique clicks for a url.
   * @param {string} shortUrl 
   */
  uniqueClicks(shortURL) {
    const url = this._urls[shortURL];
    const clickCount = Object.keys(url.clicks).length;
    return clickCount;
  }

  /**
   * Returns the long URL for a given short URL.
   * @param {string} shortURL
   */
  getLongURL(shortURL) {
    const url = this._urls[shortURL];
    if (url) {
      return url.longURL;
    } else {
      return undefined;
    }
  }

  /**
   * Returns the ID for the user who owns a given short URL.
   * @param {string} shortURL
   */
  getUserID(shortURL) {
    const url = this._urls[shortURL];
    if (url) {
      return url.userID;
    } else {
      return undefined;
    }
  }

  /**
   * Returns all urls owned by user.
   * @param {string} userID
   */
  urlsForUser(userID) {
    return Object.values(this._urls)
      .filter(url => url.userID === userID)
      .map((url) => Object.assign({}, {
        totalClicks: this.totalClicks(url.shortURL),
        uniqueClicks: this.uniqueClicks(url.shortURL),
        ...url
      }));
  }

  /**
   * Writes URL data to JSON cache file.
   */
  writeToCache() {
    if (!this._disableCache) {
      const urlData = JSON.stringify(this._urls, null, 2);
      fs.writeFile('./cache/urls.json', urlData, (err) => {
        if (err) {
          console.log('Could not write URLs to cache:', err);
        } else {
          console.log('URLs successfully written to cache.');
        }
      });
    }
  }
}

module.exports = Urls;
