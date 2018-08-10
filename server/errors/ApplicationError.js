export default class ApplicationError extends Error {
	constructor(message = 'Something went wrong, try again later.') {
		super()
		Error.captureStackTrace(this, this.constructor)

		this.name = this.constructor.name

		this.message = message
	}
}
