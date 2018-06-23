import ApplicationError from './ApplicationError'

export default class NotFoundError extends ApplicationError {
	constructor(resource) {
		super(`The ${resource} you requested was not found.`)
	}
}
