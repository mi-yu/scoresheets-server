const User = require('../models/User')
const errors = require('../config/errors')

module.exports = (req, res, next) => {
	if (req.body.group === 'admin') {
		return res.status(400).json(errors.CANNOT_REGISTER_ADMIN)
	}

	if (!req.body.password) return res.status(400).json(errors.validationError('password'))

	const newUser = new User({
		...req.body,
	})

	return newUser.save(err => {
		if (err) {
			if (err.name === 'ValidationError') {
				return res.status(400).json(errors.validationError(err.errors))
			} else if (err.name === 'MongoError' && err.code === 11000) {
				return res.status(400).json(errors.EMAIL_ALREADY_IN_USE)
			}
			return res.status(500).json(err)
		}

		const returnedUser = newUser.toObject()
		delete returnedUser.password
		return res.status(201).json(returnedUser)
	})
}
