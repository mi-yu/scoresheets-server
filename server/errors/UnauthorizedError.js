import ApplicationError from './ApplicationError'

export default class UnauthorizedError extends ApplicationError {
	constructor() {
		super('Unauthorized, please log in again to proceed.')
	}
}
