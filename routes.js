// routes.js
// All url routes for pages of the TinyApp website.

// Third Party Imports
const express = require('express');

// Local Imports
const views = require('./views');

const router = express.Router();

// Index Page
router.route("/")
.get(views.getIndexPage);

// Login Request
router.route("/login")
.get(views.getLoginPage)
.post(views.postLoginPage);

// Logout Request
router.route("/logout")
.post(views.postLogout);

// Registration Page
router.route("/register")
.get(views.getRegisterPage)
.post(views.postRegisterPage);

// URL Methods
router.route("/urls")
.get(views.getUrlsPage)
.post(views.postUrlsPage);

// New URL Request
router.route("/urls/new")
.get(views.getNewUrlPage);

// URL Details Page
router.route("/urls/:shortURL")
.get(views.getUrlDetails)
.post(views.postEditUrlDetails);

// Delete URL Request
router.route("/urls/:shortURL/delete")
.post(views.postDeleteUrl);

// Short URL Redirect
router.route("/u/:shortURL")
.get(views.shortUrlRedirect);

module.exports = router;
