import passport from 'passport'
import User from '../models/User'
import {
	ApplicationError,
	IncorrectCredentialsError,
	UnauthorizedError,
	NotFoundError,
	ForbiddenError,
} from '../errors'

export const index = (req, res, next) => {
	User.find({})
		.select('-password')
		.exec()
		.then(users => res.json(users))
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	if (req.user.id === req.params.userId || req.params.userId === 'me') {
		return res.json(req.user)
	} else if (req.user.group !== 'admin') {
		return next(new UnauthorizedError())
	}

	User.findById(req.params.userId)
		.select('-password')
		.exec()
		.then(user => {
			if (!user) throw new NotFoundError('user')
			return res.json(user)
		})
		.catch(err => next(err))
}

export const login = (req, res, next) => {
	if (!req.body.email || !req.body.password) return next(new IncorrectCredentialsError())
	passport.authenticate('local-login', (err, token, userData) => {
		if (err) {
			return next(err)
		}

		return res.json({
			message: 'You have successfully logged in!',
			user: userData,
			token,
		})
	})(req, res, next)
}

export const create = (req, res, next) => {
	if (req.body.group === 'admin') {
		return res.status(400).json(new ApplicationError('Cannot register as admin.'))
	}

	const newUser = new User({
		...req.body,
	})

	return newUser.save(err => {
		if (err) return next(err)

		const returnedUser = newUser.toObject()

		// Don't expose passwords, even if they are hashed!
		delete returnedUser.password
		return res.status(201).json(returnedUser)
	})
}

export const update = (req, res, next) => {
	// TODO: remove once we support this
	if (req.body.password) {
		return res
			.status(400)
			.json(
				new ApplicationError(
					'Changing your password is unsupported at this time, contact an administrator for help.',
				),
			)
	}

	const hasUpdatePermission = req.user.id === req.params.userId || req.user.group === 'admin'

	if (!hasUpdatePermission || req.body.group) {
		return next(new ForbiddenError())
	}

	// We don't remove password from query result here, maybe security concern.
	User.findById(req.params.userId)
		.exec()
		.then(user => {
			if (!user) throw new NotFoundError('user')
			user.set(req.body)
			return user.save()
		})
		.then(savedUser => res.json(savedUser.toObject()))
		.catch(err => next(err))
}

export const destroy = (req, res, next) => {
	User.findById(req.params.userId)
		.select('-password')
		.exec()
		.then(user => {
			if (!user) throw new NotFoundError('user')
			return user.remove()
		})
		.then(deletedUser => res.json(deletedUser.toObject()))
		.catch(err => next(err))
}
