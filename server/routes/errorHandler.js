import { DuplicateError, ValidationError, InternalServerError } from '../errors'

const errorHandler = (err, req, res, next) => {
	if (!err) return next()

	if (err.name === 'MongoError' && err.code === 11000) {
		return res.status(400).json(new DuplicateError())
	} else if (err.name === 'ValidationError') {
		return res.status(400).json(new ValidationError(err.errors))
	} else if (err.name === 'UnauthorizedError') {
		return res.status(401).json(err)
	} else if (err.name === 'NotFoundError') {
		return res.status(404).json(err)
	}

	return res.status(500).json(new InternalServerError())
}

export default errorHandler
