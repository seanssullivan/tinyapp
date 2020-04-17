// middleware/authenticate.js

/**
 * Checks user's credentials.
 * @param {object} users
 */
const authenticate = (users) => {
  return (req, res, next) => {
    req.user = null;
    req.errors = { email: null, password: null, view: null };

    if (req.session.user_id) {
      authFromCookie(req, users);

    } else if (req.originalUrl === "/login" && req.method === "POST") {
      authFromLogin(req, users);

    } else if (req.originalUrl === "/register" && req.method === "POST") {
      authFromRegistration(req, users);
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

  if (user) {
    req.user = user;
  }

  return;
};

/**
 * Verifies a user's login credentials.
 * @param {object} req
 * @param {object} users
 */
const authFromLogin = (req, users) => {
  const user = users.findUserByEmail(req.body.email);

  if (!req.body.email) {
    req.errors.email = "please enter an email address";

  } else if (!req.body.password) {
    req.errors.password = "please enter a password";

  } else if (user && user.confirmPassword(req.body.password)) {
    req.session.user_id = user.id;
    req.user = user;

  } else {
    req.errors.password = "No account found for that email and password";

  }
  return;
};

/**
 * Confirms a user's email and password when registering.
 * @param {object} req
 * @param {object} users
 */
const authFromRegistration = (req, users) => {
  if (!req.body.email) {
    req.errors.email = "please enter an email address";

  } else if (!req.body.password) {
    req.errors.password = "please enter a password";

  } else if (users.emailInUse(req.body.email)) {
    req.errors.email = "email already in use";

  } else {
    const { email, password } = req.body;
    const user = users.addUser(email, password);

    req.session.user_id = user.id;
    req.user = user;
  }
  return;
};

module.exports = { authenticate };
