// views.js
// Views handle retrieving information from the local database and rendering it into the page templates.

// Local Imports
const cachedURLs = require('./cache/urls.json');
const Urls = require('./models/urls');

const urls = new Urls(cachedURLs);

/**
 * Retrieves TinyApp's index page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const getIndexPage = (req, res) => {
  if (!req.user.id || !req.user.authenticated) {
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
  if (!req.user.authenticated) {
    res
      .status(200)
      .render("pages/login", { user: req.user });
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
  if (!req.user.authenticated) {
    res
      .status(401)
      .render("pages/login", { user: req.user });
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
  if (!req.user.authenticated) {
    res
      .status(200)
      .render("pages/register", { user: req.user });
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
  if (!req.user.id && !req.user.email) {
    res
      .status(400)
      .render("pages/register", { user: req.user });
  } else if (!req.user.id && req.user.email) {
    res
      .status(400)
      .render("pages/register", { user: req.user });
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
  const availableURLs = urls.urlsForUser(req.user.id);
  res.render("pages/urls_index", { user: req.user, urls: availableURLs });
};

/**
 * Manages POST requests to the URLs page.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postUrlsPage = (req, res) => {
  if (req.user.id) {
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
  if (req.user.id) {
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
  const shortURL = req.params.shortURL;
  const url = urls.getURL(shortURL);

  let templateVars;
  if (!url) {
    templateVars = {
      shortURL: null,
      longURL: null,
      totalClicks: null,
      uniqueClicks: null,
      owner: false,
      user: req.user
    };

  } else {
    const owner = urls.getUserID(shortURL);
    templateVars = {
      shortURL: url.shortURL,
      longURL: url.longURL,
      totalClicks: url.totalClicks,
      uniqueClicks: url.uniqueClicks,
      owner: req.user.id === owner,
      user: req.user
    };
  }

  res.render("pages/urls_show", templateVars);
};

/**
 * Manages POST requests to the edit-URL endpoint.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const postEditUrlDetails = (req, res) => {
  const shortURL = req.params.shortURL;
  const owner = urls.getUserID(shortURL);

  if (shortURL && req.user.id === owner) {
    urls.updateURL(shortURL, req.body.longURL, req.user.id);
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
const postDeleteUrl = (req, res) => {
  const shortURL = req.params.shortURL;
  const owner = urls.getUserID(shortURL);

  if (req.user.id === owner) {
    delete urls[shortURL];
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
  const urlObj = urls.getURL(shortURL);

  if (urlObj) {
    const clickID = req.session.user_id || req.ip;
    urls.incrementClicks(shortURL, clickID);
    res.redirect(urlObj.longURL);
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
  postEditUrlDetails,
  postDeleteUrl,
  shortUrlRedirect
};
