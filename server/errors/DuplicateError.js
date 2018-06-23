import ApplicationError from './ApplicationError'

export default class DuplicateError extends ApplicationError {
	constructor(field, resource) {
		const message =
			field && resource
				? `Field ${field} must be unique across ${resource}`
				: 'The resource you are trying to create already exists.'
		super(message)

		if (field && resource) {
			this.field = field
			this.resource = resource
		}
	}
}
