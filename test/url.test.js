// test/url.test.js

const { assert } = require('chai');

const { Url } = require('../models/urls');

describe("#Url", () => {

  const testUrl = new Url({
    shortURL: 't4zGbB',
    longURL: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
    userID: "user2RandomID"
  });

  it("should return a Url object", () => {
    assert.isObject(testUrl);
    assert.instanceOf(testUrl, Url);
  });

  it("should return a Urls object with an shortURL property", () => {
    assert.property(testUrl, "shortURL");
    assert.equal(testUrl.shortURL, "t4zGbB");
  });

  it("should return a Urls object with an longURL property", () => {
    assert.property(testUrl, "longURL");
    assert.equal(
      testUrl.longURL,
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference"
    );
  });

  it("should return a Urls object with a userID property", () => {
    assert.property(testUrl, "userID");
    assert.equal(testUrl.userID, "user2RandomID");
  });

  it("should return a Urls object with a owner property", () => {
    assert.property(testUrl, "owner");
    assert.equal(testUrl.owner, "user2RandomID");
  });

  it("should return a Urls object with a totalClicks property", () => {
    assert.property(testUrl, "totalClicks");
  });

  describe("#Url.totalClicks", () => {

    it("should return the number of clicks", () => {
      const numClicks = testUrl.totalClicks;
      assert.equal(numClicks, 0);
    });

  });

  it("should return a Urls object with a uniqueClicks property", () => {
    assert.property(testUrl, "uniqueClicks");
  });

  it("should return the number of unique clicks", () => {
    const numClicks = testUrl.uniqueClicks;
    assert.equal(numClicks, 0);
  });

  it("should return a Urls object with an addClick method", () => {
    assert.property(testUrl, "addClick");
  });

});