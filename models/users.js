// models/users.js

// Local Imports
const { generateRandomString } = require('../services');

/**
 * User object manages all user information.
 */
class Users {
  constructor() {
    this._users = {
      // TODO: Remove example users.
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
    }
  };

  /**
   * Adds a user object to the array of users.
   * @param {string} userEmail 
   * @param {string} userPassword 
   */
  addUser(userEmail, userPassword) {
    const newUserID = generateRandomString(8);
    const newUser = {
      id: newUserID,
      email: userEmail,
      password: userPassword
    }
    this._users[newUserID] = newUser;
    return newUserID;
  }

  /**
   * Returns the user object for a specific user id.
   * @param {string} userID 
   */
  findUserByID(userID) {
    return this._users[userID];
  }

  /**
   * Searches the array of users for a user object with a matching email address.
   * @param {string} emailAddress 
   */
  findUserByEmail(emailAddress) {
    return Object.values(this._users).find(user => user.email === emailAddress);
  }

  /**
   * Checks whether an email address is already in use by another user.
   * @param {string} emailAddress 
   */
  emailInUse(emailAddress) {
    return this.findUserByEmail(emailAddress) ? true : false;
  }
}

module.exports = Users;
