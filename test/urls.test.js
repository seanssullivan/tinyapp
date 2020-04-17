// test/urls.test.js

const { assert } = require('chai');

const { Urls, Url } = require('../models/urls');

describe("#Urls", () => {

  const urls = new Urls({}, disableCache = true);
  urls.addURL(
    "http://www.lighthouselabs.ca",
    "userRandomID"
  );
  urls.addURL(
    "http://www.google.com",
    "user2RandomID"
  );
  urls.addURL(
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
    "user2RandomID"
  );
  urls.addURL(
    "https://github.com/",
    "user3RandomID"
  );

  it("should return a Urls object", () => {
    assert.isObject(urls);
    assert.instanceOf(urls, Urls);
  });

  it("should return a Urls object with an addURL method", () => {
    assert.property(urls, "addURL");
    assert.isFunction(urls.addURL);
  });

  describe("#Urls.addURL", () => {

    it("should add a new Url class object", () => {
      const newUrl = urls.addURL("http://wikipedia.com", "user4RandomID");
      assert.instanceOf(newUrl, Url);
    });

    it("should add a new Url object with the correct longURL", () => {
      const newUrl = urls.addURL("http://wikipedia.com/javascript", "user4RandomID");
      assert.equal(newUrl.longURL, "http://wikipedia.com/javascript");
    });

    it("should add a new Url object with the correct userID", () => {
      const newUrl = urls.addURL("http://wikipedia.com/programming", "user4RandomID");
      assert.equal(newUrl.userID, "user4RandomID");
    });

  });

  it("should return a Urls object with an getLongURL method", () => {
    assert.property(urls, "getLongURL");
    assert.isFunction(urls.getLongURL);
  });

  // TODO: Rewrite tests involving shortURLs
  /* describe("#Urls.getLongURL", () => {

    it("should return the long URL when provided a short URL", () => {
      const actual = urls.getLongURL("t4zGbB");
      console.log(actual);
      const expected = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference";
      assert.equal(actual, expected);
    });

    it("should return undefined when provided with a short URL that does not exist", () => {
      const actual = urls.getLongURL("kf7fh6");
      assert.equal(actual, undefined);
    });

  }); */

  it("should return a Urls object with an getUserID method", () => {
    assert.property(urls, "getUserID");
    assert.isFunction(urls.getUserID);
  });

  describe("#Urls.getUserID", () => {

    // TODO: Rewrite test involving shortURL
    /* it("should return the user id when provided with a short url", () => {
      const actual = urls.getUserID("b2xVn2");
      assert.equal(actual, "userRandomID");
    });
    */
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
      const { shortURL, ...rest } = urls.urlsForUser("user2RandomID")[0]._data;
      const actual = JSON.stringify(rest);
      const expected = '{"longURL":"http://www.google.com","userID":"user2RandomID","clicks":{}}';
      assert.equal(actual, expected);
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