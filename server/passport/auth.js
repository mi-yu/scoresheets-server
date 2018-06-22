import jwt from 'jsonwebtoken'
import {
	UNKNOWN,
	UNAUTHORIZED,
	FORBIDDEN,
} from '../config/errors'
import User from '../models/User'

export const ensureAuthenticated = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json(UNKNOWN)
	}

	const token = req.headers.authorization.split(' ')[1]

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json(UNAUTHORIZED)
		}

		const userId = decoded.sub

		User.findById(userId, '-password', (userErr, user) => {
			if (userErr || !user) res.status(500).json(UNKNOWN)
			req.user = user
			res.locals.user = user
			next()
		})
	})
}

export const needsGroup = group => (req, res, next) => {
	if (req.user && req.user.group === group) return next()
	return res.status(403).json(FORBIDDEN)
}
