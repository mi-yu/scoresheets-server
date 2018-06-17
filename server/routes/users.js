const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const auth = require('./middleware/auth')
const register = require('../passport/register')

/* GET users listing. */
router.get('/', (req, res, next) => {
	res.redirect('/users/me')
})

router.get('/me', auth.ensureAuthenticated, (req, res, next) => {
	if (req.user.group === 'admin') res.json({ user: req.user })
	else if (req.user) res.json({ user: req.user })
	else res.redirect('/users/login')
})

router.get('/login', (req, res, next) => {
	res.json({ message: req.flash() })
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local-login', (err, token, userData) => {
		if (err) {
			if (err.name === 'IncorrectCredentialsError') {
				return res.status(400).json({
					success: false,
					message: err.message,
				})
			}

			return res.status(400).json({
				success: false,
				message: err,
			})
		}

		return res.json({
			success: true,
			message: 'You have successfully logged in!',
			token,
			user: userData,
		})
	})(req, res, next)
})

router.post('/register', register)

module.exports = router
