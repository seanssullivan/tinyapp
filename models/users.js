// users.js

const { generateRandomString } = require('../services');

class Users {
  constructor() {
    this._users = {
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

  addUser(userEmail, userPassword) {
    const newUserID = generateRandomString(8);
    const newUser = {
      id: newUserID,
      email: userEmail,
      password: userPassword
    }
    console.log("New User:", newUser);
    this._users[newUserID] = newUser;
    return newUserID;
  }

  findUserByID(userID) {
    return this._users[userID];
  }

  findUserByEmail(emailAddress) {
    return Object.values(this._users).find(user => user.email === emailAddress);
  }

  emailInUse(emailAddress) {
    return this.findUserByEmail(emailAddress) ? true : false;
  }
}

module.exports = Users;
