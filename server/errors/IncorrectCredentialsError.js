import ApplicationError from './ApplicationError'

export default class IncorrectCredentialsError extends ApplicationError {
	constructor() {
		super('Invalid credentials, please log in again.')
	}
}
