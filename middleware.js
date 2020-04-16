// middleware.js

// Third Party Imports
const bcrypt = require('bcrypt');

/**
 * Checks user's credentials.
 * @param {object} users 
 */
const authenticate = (users) => {
  return (req, res, next) => {
    if (req.cookies.user_id) {
      req.user = authFromCookie(req, res, users);

    } else if (req.body.email && req.body.password && req.url === "/login") {
      req.user = authFromLogin(req, res, users);

    } else if (req.body.email && req.body.password && req.url === "/register") {
      req.user = authFromRegistration(req, res, users);

    } else {
      req.user = { id: null, email: null, authenticated: false };
    }
    next();
  };
};

/**
 * Verifies a user's id from their cookie.
 * @param {object} req 
 * @param {object} users 
 */
const authFromCookie = (req, res, users) => {
  const userID = req.cookies.user_id;
  const user = users.findUserByID(userID);

  let credentials;
  if (user) {
    credentials = { id: user.id, email: user.email, authenticated: true };
  } else {
    credentials = { id: null, email: null, authenticated: false };
  }
  return credentials;
};

/**
 * Verifies a user's login credentials.
 * @param {object} req 
 * @param {object} users 
 */
const authFromLogin = (req, res, users) => {
  const user = users.findUserByEmail(req.body.email);

  let credentials;
  if (bcrypt.compareSync(req.body.password, user.password)) {
    credentials = { id: user.id, email: user.email, authenticated: true };
    res.cookie("user_id", req.user.id);
  } else {
    credentials = { id: user.id, email: user.id, authenticated: false };
  }
  return credentials;
};

/**
 * Confirms a user's email and password when registering.
 * @param {object} req 
 * @param {object} users 
 */
const authFromRegistration = (req, res, users) => {
  let credentials;
  if (users.emailInUse(req.body.email)) {
    credentials = { id: null, email: req.body.email, authenticated: false };
  } else {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = users.addUser(email, hashedPassword);
    credentials = { id: user.id, email: user.email, authenticated: true };
  }
  return credentials;
};

module.exports = { authenticate };
