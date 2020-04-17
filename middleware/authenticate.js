// middleware.js

// Third Party Imports
const bcrypt = require('bcrypt');

/**
 * Checks user's credentials.
 * @param {object} users
 */
const authenticate = (users) => {
  return (req, res, next) => {
    console.log(req.method);
    if (req.session.user_id) {
      req.user = authFromCookie(req, users);

    } else if (req.originalUrl === "/login" && req.method === "POST") {
      req.user = authFromLogin(req, users);

    } else if (req.originalUrl === "/register" && req.method === "POST") {
      req.user = authFromRegistration(req, users);

    } else {
      req.user = {
        id: null,
        email: null,
        authenticated: false,
        error: { email: null, password: null }
      };
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
  const userID = req.session.user_id;
  const user = users.findUserByID(userID);

  let credentials;
  if (user) {
    credentials = {
      id: user.id,
      email: user.email,
      authenticated: true,
      error: null
    };

  } else {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: null
    };
  }
  return credentials;
};

/**
 * Verifies a user's login credentials.
 * @param {object} req
 * @param {object} users
 */
const authFromLogin = (req, users) => {
  const user = users.findUserByEmail(req.body.email);

  let credentials;
  if (!req.body.email) {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: { email: "please enter an email address", password: null }
    };
  } else if (!req.body.password) {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: { email: null, password: "please enter a password" }
    };
  } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user_id = user.id;
    credentials = {
      id: user.id,
      email: user.email,
      authenticated: true,
      error: { email: null, password: null }
    };
  } else {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: { email: null, password: "No account found for that email and password" }
    };

  }
  return credentials;
};

/**
 * Confirms a user's email and password when registering.
 * @param {object} req
 * @param {object} users
 */
const authFromRegistration = (req, users) => {
  let credentials;
  if (!req.body.email) {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: { email: "please enter an email address", password: null }
    };

  } else if (!req.body.password) {
    credentials = {
      id: null,
      email: null,
      authenticated: false,
      error: { email: null, password: "please enter a password" }
    };

  } else if (users.emailInUse(req.body.email)) {
    credentials = {
      id: null,
      email: req.body.email,
      authenticated: false,
      error: { email: "email already in use", password: null }
    };


  } else {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = users.addUser(email, hashedPassword);

    req.session.user_id = user.id;
    credentials = {
      id: user.id,
      email: user.email,
      authenticated: true,
      error: null
    };
  }
  return credentials;
};

module.exports = { authenticate };
