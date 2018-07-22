import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'
import cors from 'cors'
import LoginStrategy from './passport/LoginStrategy'

// Routes
import routes from './routes'

// Create Express app
const app = express()

// Set NODE_ENV
const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
	require('dotenv').config({
		path: './.env',
	})
	// eslint-disable-next-line
	const morganBody = require('morgan-body')
	morganBody(app)
	mongoose.connect(process.env.DB_LOCAL_URL)
	mongoose.set('debug', true)
	console.log('connected to db')
} else if (env === 'production') {
	mongoose.connect(process.env.DB_URL)
}

// Mongoose
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
)
app.use(passport.initialize())

// Passport config
passport.use('local-login', LoginStrategy)

// Use routes
app.use(cors())
app.use(routes)

app.set('port', process.env.PORT || 5000)

export default app
