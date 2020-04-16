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
      req.user = authFromCookie(req, users);
    } else if (req.body.email && req.body.password && req.url === "/login") {
      req.user = authFromLogin(req, users);
    } else if (req.body.email && req.body.password && req.url === "/register") {
      req.user = authFromRegistration(req, users);
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
const authFromCookie = (req, users) => {
  const userID = req.cookies.user_id;
  const user = users.findUserByID(userID);

  if (user) {
    return { id: user.id, email: user.email, authenticated: true };
  } else {
    return { id: null, email: null, authenticated: false };
  }
};

/**
 * Verifies a user's login credentials.
 * @param {object} req 
 * @param {object} users 
 */
const authFromLogin = (req, users) => {
  const user = users.findUserByEmail(req.body.email);

  if (bcrypt.compareSync(req.body.password, user.password)) {
    return { id: user.id, email: user.email, authenticated: true };
  } else {
    return { id: user.id, email: user.id, authenticated: false };
  }
};

/**
 * Confirms a user's email and password when registering.
 * @param {object} req 
 * @param {object} users 
 */
const authFromRegistration = (req, users) => {
  if (users.emailInUse(req.body.email)) {
    return { id: null, email: req.body.email, authenticated: false };
  } else {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = users.addUser(email, hashedPassword);
    return { id: user.id, email: user.email, authenticated: true };
  }
};

module.exports = { authenticate };
