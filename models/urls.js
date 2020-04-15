// models/urls.js

const { generateRandomString } = require('../services');

class Urls {
  constructor() {
    this._urls = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: null },
      "9sm5xk": { longURL: "http://www.google.com", userID: null }
    };
  }

  all() {
    return this._urls;
  }

  addURL(longURL, userID) {
    const shortURL = generateRandomString(6);
    const urlData = {
      longURL,
      userID
    }
    this._urls[shortURL] = urlData;
    return shortURL;
  }

  updateURL(shortURL, longURL, userID) {
    if (this.getUserID(shortURL) !== userID) {
      return false;
    } else {
      this._urls[shortURL].longURL = longURL;
      return true;
    }
  }

  getLongURL(shortURL) {
    return this._urls[shortURL].longURL;
  }

  getUserID(shortURL) {
    return this._urls[shortURL].userID;
  }
}

module.exports = Urls;
