// routes.js
// All url routes for pages of the TinyApp website.

// Third Party Imports
const express = require('express');

// Local Imports
const controllers = require('./controllers');

const router = express.Router();

// Index Page
router.route("/")
.get(controllers.getIndexPage);

// Login Request
router.route("/login")
.get(controllers.getLoginPage)
.post(controllers.postLoginPage);

// Logout Request
router.route("/logout")
.post(controllers.postLogout);

// Registration Page
router.route("/register")
.get(controllers.getRegisterPage)
.post(controllers.postRegisterPage);

// URL Methods
router.route("/urls")
.get(controllers.getUrlsPage)
.post(controllers.postUrlsPage);

// New URL Request
router.route("/urls/new")
.get(controllers.getNewUrlPage);

// URL Details Page
router.route("/urls/:shortURL")
.get(controllers.getUrlDetails)
.post(controllers.postEditUrlDetails);

// Delete URL Request
router.route("/urls/:shortURL/delete")
.post(controllers.postDeleteUrl);

// Short URL Redirect
router.route("/u/:shortURL")
.get(controllers.shortUrlRedirect);

module.exports = router;
