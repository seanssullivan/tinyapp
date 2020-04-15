// views.js
// Views handle retrieving information from the local database and rendering it into the page templates.

// Local Imports
const Users = require('./models/users');
const Urls = require('./models/urls');

const users = new Users();
const urls = new Urls();

/**
 * Retrieves TinyApp's index page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const getIndexPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  if (!user) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
};

/**
 * Manages GET requests for the login page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const getLoginPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const templateVars = {
    user,
  };

  res
  .status(200)
  .render("pages/login", templateVars);
};

/**
 * Manages POST requests to the login page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postLoginPage = (req, res) => {
  if (!req.body.email) {
    res
    .status(400)
    .redirect("/urls");
  } 
  
  const user = users.findUserByEmail(req.body.email);
  if (!user || user.password !== req.body.password) {
    res
    .status(403)
    .redirect("/login");
  } else {
    res
    .status(201)
    .cookie("user_id", user.id)
    .redirect("/urls");
  }
};

/**
 * Manages POST requests to the logout endpoint.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postLogout = (req, res) => {
  res
  .status(201)
  .clearCookie("user_id")
  .redirect("/urls");
};

/**
 * Manages GET requests for the registration page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const getRegisterPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const templateVars = { user };
  res
  .status(200)
  .render("pages/register", templateVars);
};

/**
 * Manages POST requests to the registration page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postRegisterPage = (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (!userEmail || !userPassword) {
    res
    .status(400)
    .redirect("/register");
  } else if (users.emailInUse(userEmail)) {
    res.status(400)
    .redirect("/register");
  } else {
    const newUserID = users.addUser(userEmail, userPassword);
    res
    .cookie("user_id", newUserID)
    .redirect("/urls"); 
  }
};

/**
 * Manages GET requests for the URLs page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const getUrlsPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const availableURLs = urls.urlsForUser(userID);
  const templateVars = { user, urls: availableURLs };
  res.render("pages/urls_index", templateVars);
};

/**
 * Manages POST requests to the URLs page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postUrlsPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const shortUrl = urls.addURL(req.body.longURL, user.id);
  res.redirect(`/urls/${shortUrl}`);
};

/**
 * Manages GET requests for the new-URL page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 * 
 * If a user is not logged in, they will be redirected to the login page.
 */
const getNewUrlPage = (req, res) => {
  const userID = req.cookies["user_id"];
  if (!userID) {
    res
    .status(401)
    .redirect("/urls");

  } else {
    const user = users.findUserByID(userID);
    const templateVars = { user };
    res
    .status(200)
    .render("pages/urls_new", templateVars);
  }
};

/**
 * Manages GET requests for a URL's details page.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const getUrlDetails = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const shortURL = req.params.shortURL;
  const longURL = urls.getLongURL(shortURL);

  const templateVars = { user, shortURL, longURL };
  res.render("pages/urls_show", templateVars);
};

/**
 * Manages POST requests to the edit-URL endpoint.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postEditUrlDetails = (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  if (!userID || !shortURL || userID !== urls.getUserID(shortURL)) {
    res
    .status(401)
    .redirect(`/urls/${shortURL}`);

  } else {
    urls.updateURL(shortURL, req.body.longURL, userID);
    res.redirect(`/urls/${shortURL}`);
  }
};

/**
 * Manages POST requests for the delete-URL endpoint.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const postDeleteUrl = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const shortURL = req.params.shortURL;
  const url = urls.getUserID(shortURL);
  if (!user || user.id !== url.userID) {
    res
    .status(401)
    .redirect("/urls");
  } else {
    delete urls[shortURL];
    res.redirect("/urls");
  }
};

// Follow ShortURL Redirect
/**
 * Redirects all visitors to a short URL to the associated long URL.
 * @param {*} req - Request object.
 * @param {*} res - Response object.
 */
const shortUrlRedirect = (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urls.getLongURL(shortURL);
  res.redirect(longURL);
};

module.exports = {
  getIndexPage,
  getLoginPage,
  postLoginPage,
  postLogout,
  getRegisterPage,
  postRegisterPage,
  getUrlsPage,
  postUrlsPage,
  getNewUrlPage,
  getUrlDetails,
  postEditUrlDetails,
  postDeleteUrl,
  shortUrlRedirect
}
