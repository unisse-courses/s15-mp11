// All imports needed here
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('./models/connection');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const fs = require('fs');
const multer = require('multer');


// Routes imports
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

// Creates the express application
const app = express();
const port = 3000;

// Configure to use sessions
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

// Listening to the port provided
app.listen(port, () => {
  console.log('App listening at port ' + port)
});

// Creates an engine called "hbs" using the express-handlebars package.
app.engine('hbs', exphbs({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
  helpers: {
    grouped_each: function(freq, context, options) {
      var out = "", subcontext = [], i;
      if (context && context.length > 0) {
          for (i = 0; i < context.length; i++) {
              if (i > 0 && i % freq === 0) {
                  out += options.fn(subcontext);
                  subcontext = [];
              }
              subcontext.push(context[i]);
          }
          out += options.fn(subcontext);
      }
      return out;
    },
    validateUserComment: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

      operator = options.hash.operator || "==";

      var operators = {
          '==':       function(l,r) { return l == r; },
          '===':      function(l,r) { return l === r; },
          '!=':       function(l,r) { return l != r; },
          '<':        function(l,r) { return l < r; },
          '>':        function(l,r) { return l > r; },
          '<=':       function(l,r) { return l <= r; },
          '>=':       function(l,r) { return l >= r; },
          'typeof':   function(l,r) { return typeof l == r; }
      }

      if (!operators[operator])
          throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

      var result = operators[operator](lvalue,rvalue);

      if( result ) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
    }
  }
}));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

// Configuration for handling API endpoint data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// serve static files
app.use(express.static('public'));

// Sessions
app.use(session({
  secret: 'somegibberishsecret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Flash
app.use(flash());

// Global messages vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use('/', authRouter); // Login/registration routes
app.use('/', indexRouter); // Main index route
