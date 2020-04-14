// express_server.js

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const PORT = 8080;

const app = express();
app.set("views", "templates");

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use('/', routes);

// LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
