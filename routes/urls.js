// routes/urls.js
// All url routes for pages of the TinyApp website.

// Third Party Imports
const express = require('express');

// Local Imports
const controllers = require('../controllers');

const router = express.Router();

// URL Page Requests
router.route("/")
  .get(controllers.getUrlsPage)
  .post(controllers.postUrlsPage);

// New URL Page Requests
router.route("/new")
  .get(controllers.getNewUrlPage);

// URL Details Page Requests
router.route("/:shortURL")
  .get(controllers.getUrlDetails)
  .post(controllers.postEditUrlDetails);

// Delete URL Request
router.route("/:shortURL/delete")
  .post(controllers.postDeleteUrl);

module.exports = router;
