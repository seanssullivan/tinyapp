// models/users.js

// Node Imports
const fs = require('fs');

// Third Party Imports
const bcrypt = require('bcrypt');

// Local Imports
const { generateRandomString } = require('../services');

/**
 * Users object manages all user information.
 */
class Users {
  constructor(userData, disableCache = false) {
    this._users = {};
    for (const userID in userData) {
      this._users[userID] = new User(userData[userID]);
    }

    this._disableCache = disableCache;
  }

  /**
   * Adds a user object to the array of users.
   * @param {string} userEmail
   * @param {string} userPassword
   */
  addUser(email, password) {
    const newUser = new User({ email, password });
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
  constructor(userData) {
    if (userData["data"]) {
      this.data = userData.data;

    } else {
      this.data = {
        id: generateRandomString(8),
        email: userData["email"],
        password: bcrypt.hashSync(userData["password"], 10),
        date_created: new Date()
      }
    }
  }

  /**
   * Get method for retrieving the stored ID.
   */
  get id() {
    return this.data.id;
  }

  /**
   * Get method for retrieving the stored email address.
   */
  get email() {
    return this.data.email;
  }

  /**
   * Get method for retrieving the stored hashed password.
   */
  get password() {
    return this.data.password;
  }

  /**
   * Checks the provided password against the hashed password.
   * @param {string} password 
   */
  confirmPassword(password) {
    return bcrypt.compareSync(password, this.data.password);
  }
}

module.exports = Users;
