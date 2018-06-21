const jwt = require('jsonwebtoken')
const User = require('../models/User')
const errors = require('../config/errors')

exports.ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json(errors.UNKNOWN)
	}

	const token = req.headers.authorization.split(' ')[1]

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json(errors.UNAUTHORIZED)
		}

		const userId = decoded.sub

		User.findById(userId, '-password', (userErr, user) => {
			if (userErr || !user) res.status(500).json(errors.UNKNOWN)
			req.user = user
			res.locals.user = user
			next()
		})
	})
}

exports.needsGroup = group => (req, res, next) => {
	if (req.user && req.user.group === group) return next()
	return res.status(403).json(errors.FORBIDDEN)
}
