import { Router } from 'express'
import passport from 'passport'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import register from '../passport/register'
import User from '../models/User'
import { IncorrectCredentialsError, InternalServerError, UnauthorizedError } from '../errors'

const router = new Router()

/* GET users listing. */
router.get('/', ensureAuthenticated, needsGroup('admin'), (req, res, next) => {
	User.find()
		.select('-password')
		.exec()
		.then(users =>
			res.json({
				users,
			}),
		)
		.catch(() => next(new InternalServerError()))
})

router.get('/me', ensureAuthenticated, (req, res, next) => {
	// TODO: detangle this stuff
	if (req.user.group === 'admin') {
		return res.json(req.user)
	} else if (req.user) {
		return res.json(req.user)
	}

	return next(new UnauthorizedError())
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local-login', (err, token, userData) => {
		if (err) {
			if (err instanceof IncorrectCredentialsError) {
				return res.status(400).json(err)
			}

			return res.status(500).json(new InternalServerError())
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
