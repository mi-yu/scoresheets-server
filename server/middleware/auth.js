const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization)
		res.status(401).end()

	const token = req.headers.authorization.split(' ')[1]

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err)
			res.status(401).end()
		const userId = decoded.sub

		User.findById(userId, '-hash', (userErr, user) => {
			if (userErr || !user)
				res.status(401).end()
			req.user = user
			console.log(user)
			next()
		})
	})
}

exports.needsGroup = group => (req, res, next) => {
	if (req.user && req.user.group === 'group')
		next()
	else
		res.status(401).end()
}