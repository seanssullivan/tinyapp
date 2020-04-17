// models/users.js

// Node Imports
const fs = require('fs');

// Third Party Imports
const bcrypt = require('bcrypt');

// Local Imports
const { generateRandomString } = require('../services');

/**
 * User object manages all user information.
 */
class Users {
  constructor(userData, disableCache = false) {
    this._users = userData;
    this._disableCache = disableCache;
  }

  /**
   * Adds a user object to the array of users.
   * @param {string} userEmail
   * @param {string} userPassword
   */
  addUser(userEmail, userPassword) {
    const newUser = new User(userEmail, userPassword);
    this._users[newUser.id] = newUser;
    if (!this._disableCache) this.writeToCache();
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

class User {
  constructor(userEmail, userPassword) {
    this.data = {
      id: generateRandomString(8),
      email: userEmail,
      password: bcrypt.hashSync(userPassword, 10)
    }
  }

  get id() {
    return this.data.id;
  }

  get email() {
    return this.data.email;
  }

  get password() {
    return this.data.password;
  }

  confirmPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = Users;
