// routes.js

const express = require('express');
const router = express.Router();

router.route("/")
.get((req, res) => {
  res.send("Hello!");
});

router.route("/urls")
.get((req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
})
.post((req, res) => {
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

router.route("/urls/new")
.get((req, res) => {
  res.render("pages/urls_new");
});

router.route("/urls/:shortURL")
.get((req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("pages/urls_show", templateVars);
});

router.route("/urls/:shortURL/delete")
.post((req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

router.route("/u/:shortURL")
.get((req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});