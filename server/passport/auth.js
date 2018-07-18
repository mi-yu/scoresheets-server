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

export const needsGroup = (...groups) => (req, res, next) => {
	if (req.user && (groups.includes(req.user.group) || req.user.group === 'admin')) return next()
	return res.status(403).json(new ForbiddenError())
}

export const permitUnauthenticated = (req, res, next) => {
	if (!req.headers.authorization) return next()

	const token = req.headers.authorization.split(' ')[1]

	if (!token) return next()
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return next()
		}

		const userId = decoded.sub

		User.findById(userId, '-password', (userErr, user) => {
			if (userErr || !user) return next(err)
			req.user = user
			return next()
		})
	})
}
