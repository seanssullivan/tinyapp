// routes.js
// All url routes for pages of the TinyApp website.

// Third Party Imports
const express = require('express');

// Local Imports
const controllers = require('./controllers');

const router = express.Router();

// Index Page Requests
router.route("/")
.get(controllers.getIndexPage);

// Login Page Requests
router.route("/login")
.get(controllers.getLoginPage)
.post(controllers.postLoginPage);

// Logout Request
router.route("/logout")
.post(controllers.postLogout);

// Registration Page Requests
router.route("/register")
.get(controllers.getRegisterPage)
.post(controllers.postRegisterPage);

// URL Page Requests
router.route("/urls")
.get(controllers.getUrlsPage)
.post(controllers.postUrlsPage);

// New URL Page Requests
router.route("/urls/new")
.get(controllers.getNewUrlPage);

// URL Details Page Requests
router.route("/urls/:shortURL")
.get(controllers.getUrlDetails)
.post(controllers.postEditUrlDetails);

// Delete URL Request
router.route("/urls/:shortURL/delete")
.post(controllers.postDeleteUrl);

// Short URL Redirect Requests
router.route("/u/:shortURL")
.get(controllers.shortUrlRedirect);

module.exports = router;
