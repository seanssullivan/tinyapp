// test/users.test.js

const { assert } = require('chai');

const Users = require('../models/users');

const testUserData = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe("#Users", () => {

  const users = new Users(testUserData, disableCache = true);

  it("should return a Users object", () => {
    assert.isObject(users);
    assert.instanceOf(users, Users)
  });

  it("should return a Users object with the user data", () => {
    assert.deepEqual(users._users, testUserData);
  });

  it("should return a Users object with an addUser method", () => {
    assert.property(users, "addUser");
    assert.isFunction(users.addUser);
  });

  describe("#Users.addUser", () => {

    it("should add a new user to the user objects with a unique id", () => {
      const newUser = users.addUser('test@email.com', 'asimplepassword')
      assert.property(newUser, "id");
      assert.equal(newUser.email, 'test@email.com');
      assert.equal(newUser.password, 'asimplepassword');
    });

  });

  it("should return a Users object with a findUserByID method", () => {
    assert.property(users, "findUserByID");
    assert.isFunction(users.findUserByID);
  });

  describe("#Users.findUserByID", () => {

    it("should return a user with the provided ID", () => {
      const expected = testUserData.userRandomID;
      const actual = users.findUserByID("userRandomID");
      assert.deepEqual(actual, expected);
    });

    it("should return undefined if user does not exist", () => {
      const actual = users.findUserByID("user3RandomID");
      assert.equal(actual, undefined);
    });

  });

  it("should return a Users object with a findUserByEmail method", () => {
    assert.property(users, "findUserByEmail");
    assert.isFunction(users.findUserByEmail);
  });

  describe("#Users.findUserByEmail", () => {

    it("should return a user with the provided email address", () => {
      const expected = testUserData.user2RandomID;
      const actual = users.findUserByEmail("user2@example.com");
      assert.deepEqual(actual, expected);
    });

    it("should return undefined if the email address is not found", () => {
      const actual = users.findUserByEmail("user3@example.com");
      assert.deepEqual(actual, undefined);
    });

  });

  it("should return a Users object with an emailInUse method", () => {
    assert.property(users, "emailInUse");
    assert.isFunction(users.emailInUse);
  });

  describe("#Users.emailInUse", () => {

    it("should return true when an email address is already owned by another user", () => {
      const actual = users.emailInUse("user@example.com");
      assert.deepEqual(actual, true);
    });

    it("should return false when an email address is not owned by another user", () => {
      const actual = users.emailInUse("user3@example.com");
      assert.deepEqual(actual, false);
    });

  });

  it("should return a Users object with a writeToCache method", () => {
    assert.property(users, "writeToCache");
    assert.isFunction(users.writeToCache);
  });


});