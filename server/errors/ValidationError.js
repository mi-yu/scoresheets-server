import ApplicationError from './ApplicationError'

export default class ValidationError extends ApplicationError {
	constructor(errors) {
		super('There was an error validating your data.')

		this.fields = Object.keys(errors).map(field => ({
			field,
			kind: errors[field].kind,
		}))
	}
}
