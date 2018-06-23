import ApplicationError from './ApplicationError'

export default class ForbiddenError extends ApplicationError {
	constructor() {
		super(
			'You are not authorized to interact with this content, contact an admin for more information.',
		)
	}
}
