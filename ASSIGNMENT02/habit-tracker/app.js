// Loading the environment variables and connecting to MongoDB
require('dotenv').config();
const connectDB = require('./config/db');
connectDB(); // Connect to MongoDB

// Auth & Session
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport); // Passport config

// Required packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs'); // ✅ Added to register partials

// ✅ Register HBS partials for shared header/footer
hbs.registerPartials(path.join(__dirname, 'views/partials'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var habitsRouter = require('./routes/habits');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: 'habitTrackerSecret',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messaging
app.use(flash());

// Global flash variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // For Passport errors
  res.locals.user = req.user || null;
  next();
});

// ✅ Route Setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/habits', habitsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
