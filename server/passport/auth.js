import jwt from 'jsonwebtoken'
import User from '../models/User'
import { UnauthorizedError, ForbiddenError } from '../errors'

export const ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization) return next(new UnauthorizedError())

	const token = req.headers.authorization.split(' ')[1]

	if (!token) return next(new UnauthorizedError())
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return next(new UnauthorizedError())
		}

		const userId = decoded.sub

		User.findById(userId, '-password', (userErr, user) => {
			if (userErr || !user) return next(err)
			req.user = user
			return next()
		})
	})
}

export const needsGroup = group => (req, res, next) => {
	if (req.user && req.user.group === group) return next()
	return res.status(403).json(new ForbiddenError())
}
