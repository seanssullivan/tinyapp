// test/urls.test.js

const { assert } = require('chai');

const Urls = require('../models/urls');

const testURLsData = {
  "b2xVn2": {
    "shortURL": "b2xVn2",
    "longURL": "http://www.lighthouselabs.ca",
    "userID": "userRandomID",
    "clicks": {}
  },
  "9sm5xk": {
    "shortURL": "9sm5xk",
    "longURL": "http://www.google.com",
    "userID": "user2RandomID",
    "clicks": {}
  },
  "el2GIL": {
    "shortURL": "el2GIL",
    "longURL": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
    "userID": "user2RandomID",
    "clicks": {}
  },
  "hs8G6f": {
    "shortURL": "hs8G6f",
    "longURL": "https://news.ycombinator.com/",
    "userID": "user3RandomID",
    "clicks": {}
  }
}

describe("#Urls", () => {

  const urls = new Urls(testURLsData, disableCache = true);

  it("should return a Urls object", () => {
    assert.isObject(urls);
    assert.instanceOf(urls, Urls)
  });

  it("should return a Urls object with the url data", () => {
    assert.deepEqual(urls._urls, testURLsData);
  });

  it("should return a Urls object with an addURL method", () => {
    assert.property(urls, "addURL");
    assert.isFunction(urls.addURL);
  });

  describe("#Urls.addURL", () => {

    it("should add a new url to the url objects with a unique shortURL", () => {
      const newUrl = urls.addURL("http://wikipedia.com", "user4RandomID");
      const newShortURL = newUrl.shortURL;
      assert.property(urls._urls[newShortURL], "shortURL");
      assert.equal(urls._urls[newShortURL].longURL, "http://wikipedia.com");
      assert.equal(urls._urls[newShortURL].userID, "user4RandomID");
    });

  });

  it("should return a Urls object with an updateURL method", () => {
    assert.property(urls, "updateURL");
    assert.isFunction(urls.updateURL);
  });

  describe("#Urls.updateURL", () => {

    it("should return true after updating an existing url", () => {
      const response = urls.updateURL("hs8G6f", "https://www.netflix.com", "user3RandomID");
      assert.equal(response, true);
    });

    it("should return false when a user other than the owner attempts to update a url", () => {
      const response = urls.updateURL("b2xVn2", "https://stackoverflow.com/", "user3RandomID");
      assert.equal(response, false);
    });

  });

  it("should return a Urls object with an getLongURL method", () => {
    assert.property(urls, "getLongURL");
    assert.isFunction(urls.getLongURL);
  });

  describe("#Urls.getLongURL", () => {

    it("should return the long URL when provided a short URL", () => {
      const actual = urls.getLongURL("el2GIL");
      const expected = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference";
      assert.equal(actual, expected);
    });

    it("should return undefined when provided with a short URL that does not exist", () => {
      const actual = urls.getLongURL("kf7fh6");
      assert.equal(actual, undefined);
    });

  });

  it("should return a Urls object with an getUserID method", () => {
    assert.property(urls, "getUserID");
    assert.isFunction(urls.getUserID);
  });

  describe("#Urls.getUserID", () => {

    it("should return the user id when provided with a short url", () => {
      const actual = urls.getUserID("b2xVn2");
      assert.equal(actual, "userRandomID");
    });

    it("should return undefined when the short url does not exist", () => {
      const actual = urls.getUserID("n47dhz");
      assert.equal(actual, undefined);
    });

  });

  it("should return a Urls object with an urlsForUser method", () => {
    assert.property(urls, "urlsForUser");
    assert.isFunction(urls.urlsForUser);
  });

  describe("#Urls.urlsForUser", () => {

    it("should return an array of url objects for a user", () => {
      const actual = urls.urlsForUser("user2RandomID");
      const expected = [
        {
          "shortURL": "9sm5xk",
          "longURL": "http://www.google.com",
          "userID": "user2RandomID",
          "clicks": {},
          "totalClicks": 0,
          "uniqueClicks": 0
        },
        {
          "shortURL": "el2GIL",
          "longURL": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
          "userID": "user2RandomID",
          "clicks": {},
          "totalClicks": 0,
          "uniqueClicks": 0
        }
      ];
      assert.deepEqual(actual, expected);
    });

    it("should return an empty array if user has no urls", () => {
      const actual = urls.urlsForUser("user5RandomID");
      const expected = [];
      assert.deepEqual(actual, expected);
    });

  });

  it("should return a Urls object with a writeToCache method", () => {
    assert.property(urls, "writeToCache");
    assert.isFunction(urls.writeToCache);
  });


});