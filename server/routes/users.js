const router = require('express').Router()
const passport = require('passport')
const { ensureAuthenticated } = require('./middleware/auth')
const register = require('../passport/register')

/* GET users listing. */
router.get('/', (req, res) => {
	res.redirect('/users/me')
})

router.get('/me', ensureAuthenticated, (req, res) => {
	if (req.user.group === 'admin') res.json({ user: req.user })
	else if (req.user) res.json({ user: req.user })
	else res.redirect('/users/login')
})

router.get('/login', (req, res) => {
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
			user: userData,
			token,
		})
	})(req, res, next)
})

router.post('/register', register)

module.exports = router
