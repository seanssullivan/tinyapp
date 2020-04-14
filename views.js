// views.js
// Views handle retrieving information from the local database and rendering it into the page templates.

// Local Imports
const { generateRandomString } = require('./services');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};


// Index Page
const getIndexPage = (req, res) => {
  res.send("Hello!");
};

// Login
const postLogin = (req, res) => {
  res
  .status(201)
  .cookie("username", req.body.username)
  .redirect("/urls");
};

// Logout
const postLogout = (req, res) => {
  res
  .status(201)
  .clearCookie("username")
  .redirect("/urls");
};

// URLs Page
const getUrlsPage = (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("pages/urls_index", templateVars);
};

const postUrlsPage = (req, res) => {
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
};

// New URLs Page
const getNewUrlPage = (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("pages/urls_new", templateVars);
};

// URLs Details Page
const getUrlDetails = (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    username: req.cookies["username"]
  };
  res.render("pages/urls_show", templateVars);
};

const postEditUrlDetails = (req, res) => {
  const shortUrl = req.params.shortURL;
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
};

const postDeleteUrl = (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
};

// Follow ShortURL Redirect
const shortUrlRedirect = (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
};

module.exports = {
  getIndexPage,
  postLogin,
  postLogout,
  getUrlsPage,
  postUrlsPage,
  getNewUrlPage,
  getUrlDetails,
  postEditUrlDetails,
  postDeleteUrl,
  shortUrlRedirect
}
