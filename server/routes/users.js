import {
	Router,
} from 'express'
import passport from 'passport'
import {
	ensureAuthenticated,
	needsGroup,
} from '../passport/auth'
import register from '../passport/register'
import User from '../models/User'
import {
	UNKNOWN,
	UNAUTHORIZED,
	INCORRECT_CREDENTIALS,
} from '../config/errors'

const router = new Router()

/* GET users listing. */
router.get('/', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	User.find()
		.select('-password')
		.exec()
		.then(users => res.json({
			users,
		}))
		.catch(() => res.status(500).json(UNKNOWN))
})

router.get('/me', ensureAuthenticated, (req, res) => {
	// TODO: detangle this stuff
	if (req.user.group === 'admin') {
		return res.json({
			user: req.user,
		})
	} else if (req.user) {
		return res.json({
			user: req.user,
		})
	}
	return res.status(401).json(UNAUTHORIZED)
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local-login', (err, token, userData) => {
		if (err) {
			if (err.name === 'IncorrectCredentialsError') {
				return res.status(400).json(INCORRECT_CREDENTIALS)
			}

			return res.status(500).json(UNKNOWN)
		}

		return res.json({
			message: 'You have successfully logged in!',
			user: userData,
			token,
		})
	})(req, res, next)
})

router.post('/register', register)

export default router
