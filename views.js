// views.js

const { generateRandomString } = require('./services');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};


// Index Page
const getIndexPage = (req, res) => {
  res.send("Hello!");
};

// URLs Page
const getUrlsPage = (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
};

const postUrlsPage = (req, res) => {
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
};

// New URLs Page
const getNewUrlPage = (req, res) => {
  res.render("pages/urls_new");
};

// URLs Details Page
const getUrlDetails = (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("pages/urls_show", templateVars);
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
  getUrlsPage,
  postUrlsPage,
  getNewUrlPage,
  getUrlDetails,
  postDeleteUrl,
  shortUrlRedirect
}
