// express_server.js

// Third Party Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

// Local Imports
const settings = require('./settings.json');
const routes = require('./routes');
const { authenticate } = require('./middleware');
const Users = require('./models/users');

const users = new Users();

const app = express();
app.set("views", settings.VIEW_DIR);

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [],
  maxAge: 24 * 60 * 60 * 1000
}));

// CUSTOM MIDDLEWARE
app.use(authenticate(users));

// ROUTES
app.use('/', routes);

// LISTENER
app.listen(settings.PORT, () => {
  console.log(`Example app listening on port ${settings.PORT}!`);
});
