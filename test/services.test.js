// test/urls.test.js

const { assert } = require('chai');

const { generateRandomString } = require('../services');

describe("#Urls", () => {

  it("should return a random string of a given length", () => {
    const randomString = generateRandomString(13);
    assert.equal(randomString.length, 13);
  });

  it("should be composed of alphanumeric characters", () => {
    const randomString = generateRandomString(7);
    const allAlpha = /[a-zA-Z0-9]/g.test(randomString);
    assert.equal(allAlpha, true);
  });

});
