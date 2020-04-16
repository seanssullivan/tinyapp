// middleware.js

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

const authFromCookie = (req, users) => {
  const userID = req.cookies.user_id;
  const user = users.findUserByID(userID);

  if (user) {
    return { id: user.id, email: user.email, authenticated: true };
  } else {
    return { id: null, email: null, authenticated: false };
  }
};

const authFromLogin = (req, users) => {
  const user = users.findUserByEmail(req.body.email);

  if (user.password === req.body.password) {
    return { id: user.id, email: user.email, authenticated: true };
  } else {
    return { id: user.id, email: user.id, authenticated: false };
  }
};

const authFromRegistration = (req, users) => {
  if (users.emailInUse(req.body.email)) {
    return { id: null, email: req.body.email, authenticated: false };
  } else {
    const user = users.addUser(req.body.email, req.body.password);
    return { id: user.id, email: user.email, authenticated: true };
  }
};

module.exports = { authenticate };
