// models/urls.js

const { generateRandomString } = require('../services');

class Urls {
  constructor() {
    this._urls = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: null },
      "9sm5xk": { longURL: "http://www.google.com", userID: null }
    };
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
      longURL,
      userID
    }
    this._urls[shortURL] = urlData;
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
      return true;
    }
  }
}

module.exports = Urls;
