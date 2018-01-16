const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

// Routes
const basic = require('./routes/basic');
const users = require('./routes/users');
const admin = require('./routes/admin');
const tournaments = require('./routes/tournaments');
const scoresheets = require('./routes/scoresheets');
const events = require('./routes/events');

// DB and authentication
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Create Express app
const app = express();

// Set environment
const env = process.env.NODE_ENV;

if ('development' == env) {
    const logger = require('morgan');
    require('dotenv').config();
    app.use(logger('dev'));
    mongoose.connection.openUri(process.env.DB_LOCAL_URL);
    mongoose.set('debug', true);
} else if ('test' == env) {
    require('dotenv').config();
} else {
    mongoose.connection.openUri(process.env.DB_URL);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(session({ secret: 'koala', resave: false, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport config 
var User = require('./models/User');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose
mongoose.Promise = global.Promise;

// Use routes
app.use((req, res, next) => {
    res.locals.user = req.user;
    if (process.env.NODE_ENV === 'development') {
        res.locals.user = {}
        res.locals.user.group = 'admin'
    }
    next();
});

app.use('/', basic);
app.use('/users', users);
app.use('/admin', admin);
app.use('/tournaments', tournaments);
app.use('/scoresheets', scoresheets);
app.use('/events', events);

app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
