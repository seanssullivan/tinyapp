// models/users.js

// Node Imports
const fs = require('fs');

// Local Imports
const { generateRandomString } = require('../services');

/**
 * User object manages all user information.
 */
class Users {
  constructor(userData) {
    this._users = userData;
  }

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
    };
    this._users[newUserID] = newUser;
    this.writeToCache();
    return newUser;
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

  /**
   * Writes user data to JSON cache file.
   */
  writeToCache() {
    const userData = JSON.stringify(this._users, null, 2);
    fs.writeFile('cache/users.json', userData, (err) => {
      if (err) {
        console.log('Could not write users to cache:', err);
      } else {
        console.log('Users successfully written to cache.');
      }
    });
  }
}

module.exports = Users;
