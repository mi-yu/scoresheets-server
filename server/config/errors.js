module.exports = {
	CANNOT_REGISTER_ADMIN: {
		code: 'cannot_register_admin',
		message: 'You cannot register as a site admin.',
	},
	EMAIL_ALREADY_IN_USE: {
		code: 'email_already_in_use',
		message: 'The email you have submitted has already been registered.',
	},
	FORBIDDEN: {
		code: 'forbidden',
		message:
			'You are not authorized to access this content, contact an administrator for more information',
	},
	INCORRECT_CREDENTIALS: {
		code: 'incorrect_credentials',
		message: 'Invalid email and/or password.',
	},
	UNAUTHORIZED: {
		code: 'invalid_auth_token',
		message: 'Unauthorized, please log in to proceed.',
	},
	UNKNOWN: {
		code: 'unknown_error',
		message: 'An unknown error occurred, try again later.',
	},
	validationError: missingPath => ({
		code: 'validation_error',
		message: 'Missing or invalid form data.',
		missingPath,
	}),
}
