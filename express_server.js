// express_server.js

// Third Party Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

// Local Imports
const settings = require('./settings.json');
const { authenticate } = require('./middleware/authenticate');
const Users = require('./models/users');

// Import Routers
const mainRouter = require('./routes/main');
const urlRouter = require('./routes/urls');

// DATABASE
const users = new Users();

// APP SETUP
const app = express();
app.set("views", settings.VIEW_DIR);

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ["testkey1", "testkey2", "testkey3"],
  maxAge: 24 * 60 * 60 * 1000
}));

// CUSTOM MIDDLEWARE
app.use(authenticate(users));

// ROUTES
app.use('/', mainRouter);
app.use('/urls', urlRouter);

// LISTENER
app.listen(settings.PORT, () => {
  console.log(`Example app listening on port ${settings.PORT}!`);
});
