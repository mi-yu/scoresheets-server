import ApplicationError from './ApplicationError'

export default class EmailTakenError extends ApplicationError {
	constructor() {
		super('The email you have submitted has already been used.')
	}
}
