// express_server.js

// Third Party Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Local Imports
const routes = require('./routes');

const PORT = 8080;

const app = express();
app.set("views", "templates");

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use('/', routes);

// LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
