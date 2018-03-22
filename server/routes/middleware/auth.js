const jwt = require('jsonwebtoken')
const User = require('../../models/User')

exports.ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization) {
		req.flash('error', 'Unauthorized, please log in.')
		console.log(req.flash())
		return res.redirect('/users/login')
	}

	const token = req.headers.authorization.split(' ')[1]

	console.log(token)

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		console.log('verifying token')
		if (err) {
			return res.status(401).json({
				message: 'Unauthorized, please log in.'
			})
		}

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
	if (req.user && req.user.group === group)
		next()
	else
		return res.status(401).end()
}