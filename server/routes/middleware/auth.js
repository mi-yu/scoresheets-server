const jwt = require('jsonwebtoken')
const User = require('../../models/User')

exports.ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization)
		res.status(401).end()

	const token = req.headers.authorization.split(' ')[1]

	console.log(token)

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err)
			res.status(401).end()
		const userId = decoded.sub
		console.log(decoded)

		User.findById(userId, '-password', (userErr, user) => {
			if (userErr || !user)
				res.status(401).end()
			req.user = user
			res.locals.user = user
			next()
		})
	})
}

exports.needsGroup = group => (req, res, next) => {
	if (req.user && req.user.group === group || process.env.NODE_ENV === 'development')
		next()
	else
		res.status(401).end()
}