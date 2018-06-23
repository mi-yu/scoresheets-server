import ApplicationError from './ApplicationError'

export default class InternalServerError extends ApplicationError {
	constructor(field, resource) {
		super('There was a problem on the server, please try again.')
	}
}
