const router = require('express').Router()
const passport = require('passport')
const { ensureAuthenticated, needsGroup } = require('../passport/auth')
const register = require('../passport/register')
const User = require('../models/User')
const errors = require('../config/errors')

/* GET users listing. */
router.get('/', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	User.find()
		.select('-password')
		.exec()
		.then(users => res.json({ users }))
		.catch(() => res.status(500).json(errors.UNKNOWN))
})

router.get('/me', ensureAuthenticated, (req, res) => {
	// TODO: detangle this stuff
	if (req.user.group === 'admin') return res.json({ user: req.user })
	else if (req.user) return res.json({ user: req.user })
	return res.status(401).json(errors.UNAUTHORIZED)
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local-login', (err, token, userData) => {
		if (err) {
			if (err.name === 'IncorrectCredentialsError') {
				return res.status(400).json(errors.INCORRECT_CREDENTIALS)
			}

			return res.status(500).json(errors.UNKNOWN)
		}

		return res.json({
			message: 'You have successfully logged in!',
			user: userData,
			token,
		})
	})(req, res, next)
})

router.post('/register', register)

module.exports = router
