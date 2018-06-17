const User = require('../models/User')

module.exports = (req, res, next) => {
	if (req.body.group === 'admin') {
		return res.json({
			message: {
				error: 'Cannot register as admin.',
			},
		})
	}
	const newUser = new User({
		...req.body,
	})

	return newUser.save(err => {
		if (err) return next(err)

		return res.json({
			message: {
				success: 'Registration successful.',
			},
		})
	})
}
