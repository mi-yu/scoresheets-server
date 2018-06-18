const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')

// Routes
const basic = require('./server/routes/basic')
const users = require('./server/routes/users')
const admin = require('./server/routes/admin')
const tournaments = require('./server/routes/tournaments')
const scoresheets = require('./server/routes/scoresheets')
const events = require('./server/routes/events')

// DB and authentication
const mongoose = require('mongoose')
const passport = require('passport')
const LoginStrategy = require('./server/passport/login')

// Create Express app
const app = express()

// Set environment
const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
	const logger = require('morgan')
	require('dotenv').config({
		path: './.env',
	})
	app.use(logger('dev'))
	mongoose.connection.openUri(process.env.DB_REACT_LOCAL_URL)
	mongoose.set('debug', true)
} else {
	mongoose.connection.openUri(process.env.DB_URL)
}

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(session({ secret: 'koala', resave: false, saveUninitialized: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(flash())

// Passport config
passport.use('local-login', LoginStrategy)

// Mongoose
mongoose.Promise = global.Promise

// Use routes
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	)
	next()
})
app.use(express.static(path.join(__dirname, 'client/build')))
app.use('/', basic)
app.use('/users', users)
app.use('/admin', admin)
app.use('/tournaments', tournaments)
app.use('/scoresheets', scoresheets)
app.use('/events', events)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	// res.locals.message = err.message
	// res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	// res.locals.title = 'Error: ' + res.status
	// res.render('error');
	res.json({
		message: {
			error: err.message,
		},
	})
})

app.set('port', process.env.PORT || 5000)

module.exports = app
