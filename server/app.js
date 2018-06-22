import express from 'express'
const path = require('path')
const bodyParser = require('body-parser')

// Routes
const basic = require('./routes/basic')
const users = require('./routes/users')
const admin = require('./routes/admin')
import tournaments from './routes/tournaments'
const teams = require('./routes/teams')
const scoresheets = require('./routes/scoresheets')
const events = require('./routes/events')

// DB and authentication
const mongoose = require('mongoose')
const passport = require('passport')
const LoginStrategy = require('./passport/login')

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

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
app.use('/tournaments/:tournamentId/teams', teams)
app.use('/scoresheets', scoresheets)
app.use('/events', events)

app.all('*', (req, res) => res.json(errors.UNKNOWN))

// error handler
// app.use((err, req, res) => {
// })

app.set('port', process.env.PORT || 5000)

export default app