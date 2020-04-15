// views.js
// Views handle retrieving information from the local database and rendering it into the page templates.

// Local Imports
const Users = require('./models/users');
const { generateRandomString } = require('./services');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const users = new Users();

// Index Page
const getIndexPage = (req, res) => {
  res.send("Hello!");
};

// Login Page
const getLoginPage = (req, res) => {
  res
  .status(200)
  .render("pages/login");
};

const postLoginPage = (req, res) => {
  if (!req.body.email) {
    res
    .status(400)
    .redirect("/urls");
  } 
  
  const user = users.findUserByEmail(req.body.email);
  if (!user || user.password !== req.body.password) {
    res
    .status(400)
    .redirect("/login");
  } else {
    res
    .status(201)
    .cookie("user_id", user.id)
    .redirect("/urls");
  }
};

// Logout
const postLogout = (req, res) => {
  res
  .status(201)
  .clearCookie("user_id")
  .redirect("/urls");
};

// Register
const getRegisterPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const templateVars = {
    user,
  };
  res
  .status(200)
  .render("pages/register", templateVars);
};

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

// URLs Page
const getUrlsPage = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const templateVars = {
    user,
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
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const templateVars = {
    user
  };
  res.render("pages/urls_new", templateVars);
};

// URLs Details Page
const getUrlDetails = (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users.findUserByID(userID);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = {
    user,
    shortURL,
    longURL,
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
