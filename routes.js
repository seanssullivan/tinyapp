// routes.js

const express = require('express');
const views = require('./views');


const router = express.Router();

router.route("/")
.get(views.getIndexPage);

router.route("/urls")
.get(views.getUrlsPage)
.post(views.postUrlsPage);

router.route("/urls/new")
.get(views.getNewUrlPage);

router.route("/urls/:shortURL")
.get(views.getUrlDetails);

router.route("/urls/:shortURL/delete")
.post(views.postDeleteUrl);

router.route("/u/:shortURL")
.get(views.shortUrlRedirect);

module.exports = router;
