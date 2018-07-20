import ApplicationError from './ApplicationError'

export default class ValidationError extends ApplicationError {
	constructor(message = 'There was an error validating your data.', errors) {
		super(message)

		this.fields = Object.keys(errors).map(field => ({
			field,
			kind: errors[field].kind,
		}))
	}
}
