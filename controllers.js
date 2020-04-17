// views.js
// Views handle retrieving information from the local database and rendering it into the page templates.

// Local Imports
const cachedURLs = require('./cache/urls.json');
const { Urls } = require('./models/urls');

const urls = new Urls(cachedURLs);

/**
 * Retrieves TinyApp's index page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getIndexPage = (req, res) => {
  if (!req.user) {
    // If user is not logged in, redirect to /login
    res.redirect("/login");
  } else {
    // If user is logged in, redirect to /urls
    res.redirect("/urls");
  }
};

/**
 * Manages GET requests for the login page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getLoginPage = (req, res) => {
  if (!req.user) {
    res
      .status(200)
      .render("pages/login", { user: req.user, errors: req.errors });
  } else {
    res
      .status(307)
      .redirect('/urls');
  }
};

/**
 * Manages POST requests to the login page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postLoginPage = (req, res) => {
  if (!req.user) {
    res
      .status(401)
      .render("pages/login", { user: req.user, errors: req.errors });
  } else {
    res
      .status(200)
      .redirect("/urls");
  }
};

/**
 * Manages POST requests to the logout endpoint.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postLogout = (req, res) => {
  req.session = null;
  res
    .status(201)
    .redirect("/urls");
};

/**
 * Manages GET requests for the registration page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getRegisterPage = (req, res) => {
  if (!req.user) {
    res
      .status(200)
      .render("pages/register", { user: req.user, errors: req.errors });
  }  else {
    res
      .status(307)
      .redirect('/urls');
  }
};

/**
 * Manages POST requests to the registration page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postRegisterPage = (req, res) => {
  if (!req.user) {
    res
      .status(400)
      .render("pages/register", { user: req.user, errors: req.errors });
  } else {
    res
      .cookie("user_id", req.user.id)
      .redirect("/urls");
  }
};

/**
 * Manages GET requests for the URLs page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getUrlsPage = (req, res) => {
  if (req.user) {
    res.render("pages/urls_index", {
      user: req.user,
      urls: urls.urlsForUser(req.user.id)
    });
  } else {
    res.render("pages/urls_index", {
      user: req.user,
      urls: null
    });
  }
};

/**
 * Manages POST requests to the URLs page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postUrlsPage = (req, res) => {
  if (req.user) {
    const url = urls.addURL(req.body.longURL, req.user.id);
    res.redirect(`/urls/${url.shortURL}`);
  } else {
    res.redirect("/urls");
  }
};

/**
 * Manages GET requests for the new-URL page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 *
 * If a user is not logged in, they will be redirected to the login page.
 */
const getNewUrlPage = (req, res) => {
  if (req.user) {
    res
      .status(200)
      .render("pages/urls_new", { user: req.user });
  } else {
    res
      .status(401)
      .redirect("/login");
  }
};

/**
 * Manages GET requests for a URL's details page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getUrlDetails = (req, res) => {
  const url = urls.getURL(req.params.shortURL);
  res.render("pages/urls_show", { url, user: req.user });
};

/**
 * Manages POST requests to the edit-URL endpoint.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const editUrlDetails = (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urls.getURL(shortURL);

  if (shortURL && req.user && req.user.id === url.owner) {
    url.longURL = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    res
      .status(401)
      .redirect(`/urls/${shortURL}`);
  }
};

/**
 * Manages POST requests for the delete-URL endpoint.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const deleteUrl = (req, res) => {
  const shortURL = req.params.shortURL;
  const owner = urls.getUserID(shortURL);

  if (shortURL && req.user && req.user.id === owner) {
    urls.deleteURL(shortURL);
    res.redirect("/urls");

  } else {
    res
      .status(401)
      .redirect("/urls");
  }
};

// Follow ShortURL Redirect
/**
 * Redirects all visitors to a short URL to the associated long URL.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const shortUrlRedirect = (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urls.getURL(shortURL);

  if (url) {
    const clickID = req.session.user_id || req.ip;
    url.addClick(clickID);
    res.redirect(url.longURL);
  } else {
    res.redirect(`/urls/${shortURL}`);
  }
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
  editUrlDetails,
  deleteUrl,
  shortUrlRedirect
};
