import { DuplicateError, ValidationError, InternalServerError } from '../errors'

const errorHandler = (err, req, res, next) => {
	if (err.name === 'MongoError' && err.code === 11000) {
		return res.status(400).json(new DuplicateError())
	} else if (err.name === 'ValidationError') {
		return res.status(400).json(new ValidationError(err.errors))
	}

	return res.status(500).json(new InternalServerError())
}

export default errorHandler
