import User from '../models/User'
import { ValidationError, ApplicationError } from '../errors'

const register = (req, res, next) => {
	if (req.body.group === 'admin') {
		return res.status(400).json(new ApplicationError('Cannot register as admin.'))
	}

	if (!req.body.password) {
		return res.status(400).json(
			new ValidationError({
				password: {
					kind: 'required',
				},
			}),
		)
	}

	const newUser = new User({
		...req.body,
	})

	return newUser.save(err => {
		if (err) return next(err)

		const returnedUser = newUser.toObject()
		delete returnedUser.password
		return res.status(201).json(returnedUser)
	})
}

export default register
