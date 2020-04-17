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
      userID
    };
    const newURL = new Url(urlData);
    this._urls[shortURL] = newURL;
    this.writeToCache();
    return newURL;
  }

  /**
   * Returns a url object for a provided short URL.
   * @param {string} shortURL
   */
  getURL(shortURL) {
    return this._urls[shortURL];
  }

  /**
   * Returns the long URL for a given short URL.
   * @param {string} shortURL
   */
  getLongURL(shortURL) {
    const url = this._urls[shortURL];
    // console.log(url);
    return url.longURL;
  }

  /**
   * Returns the ID for the user who owns a given short URL.
   * @param {string} shortURL
   */
  getUserID(shortURL) {
    const url = this._urls[shortURL];
    if (url) return url.userID;
  }

  /**
   * Deletes a short URL.
   * @param {string} shortURL 
   */
  deleteURL(shortURL) {
    delete this._data[shortURL];
  }

  /**
   * Returns all urls owned by user.
   * @param {string} userID
   */
  urlsForUser(userID) {
    return Object.values(this._urls)
      .filter(url => url.userID === userID);
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

class Url {
  constructor(urlData) {
    this._data = {
      shortURL: urlData.shortURL,
      longURL: urlData.longURL,
      userID: urlData.userID,
      clicks: {}
    } 
  }

  get shortURL() {
    return this._data.shortURL;
  }

  get longURL() {
    return this._data.longURL;
  }

  set longURL(newURL) {
    this._data.longURL = newURL;
  }

  get userID() {
    return this._data.userID;
  }

  get owner() {
    return this.userID;
  }

  /**
   * Calculates the total number of clicks for a url.
   */
  get totalClicks() {
    const clickCount = Object
      .values(this._data.clicks)
      .reduce((total, dates) => total + dates.length, 0);
    return clickCount;
  }

  /**
   * Calculates the total number of unique clicks for a url.
   */
  get uniqueClicks() {
    const clickCount = Object.keys(this._data.clicks).length;
    return clickCount;
  }

  /**
   * Adds a click to the url data.
   * @param {string} shortURL
   * @param {string} visitorID
   */
  addClick(visitorID) {
    const clicks = this._data.clicks;
    if (!clicks[visitorID]) {
      clicks[visitorID] = [];
    }
    clicks[visitorID].push(new Date());
  }
}

module.exports = { Urls, Url };
