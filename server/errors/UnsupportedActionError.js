import ApplicationError from './ApplicationError'

export default class UnsupportedActionError extends ApplicationError {
	constructor() {
		super('The action you have attempted is unsupported.')
	}
}
