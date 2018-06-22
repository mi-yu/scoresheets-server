import User from '../models/User'
import {
	CANNOT_REGISTER_ADMIN,
	EMAIL_ALREADY_IN_USE,
	validationError,
} from '../config/errors'

const register = (req, res, next) => {
	if (req.body.group === 'admin') {
		return res.status(400).json(CANNOT_REGISTER_ADMIN)
	}

	if (!req.body.password) return res.status(400).json(validationError('password'))

	const newUser = new User({
		...req.body,
	})

	return newUser.save(err => {
		if (err) {
			if (err.name === 'ValidationError') {
				return res.status(400).json(validationError(err.errors))
			} else if (err.name === 'MongoError' && err.code === 11000) {
				return res.status(400).json(EMAIL_ALREADY_IN_USE)
			}
			return res.status(500).json(err)
		}

		const returnedUser = newUser.toObject()
		delete returnedUser.password
		return res.status(201).json(returnedUser)
	})
}

export default register
