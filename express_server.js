// express_server.js

// Third Party Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

// Local Imports
const settings = require('./settings.json');
const { authenticate } = require('./middleware/authenticate');
const cachedUsers = require('./cache/users.json');
const Users = require('./models/users');

// Import Routers
const mainRouter = require('./routes/main_router');
const urlsRouter = require('./routes/urls_router');

// DATABASES
const users = new Users(cachedUsers);

// APP SETUP
const app = express();
app.set("views", settings.VIEW_DIR);

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
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
app.use('/urls', urlsRouter);

// LISTENER
app.listen(settings.PORT, () => {
  console.log(`Example app listening on port ${settings.PORT}!`);
});
