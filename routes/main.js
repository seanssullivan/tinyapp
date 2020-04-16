// routes/main.js
// All primary routes for pages of the TinyApp website.

// Third Party Imports
const express = require('express');

// Local Imports
const controllers = require('../controllers');

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

module.exports = router;
