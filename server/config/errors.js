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
		message: 'You are not authorized to access this content, contact an administrator for more information',
	},
	INCORRECT_CREDENTIALS: {
		code: 'incorrect_credentials',
		message: 'Invalid email and/or password.',
	},
	INTERNAL_SERVER_ERROR: {
		code: 'internal_server_error',
		message: 'Sorry, something went wrong on the server, try again later.',
	},
	NO_TOURNAMENTS: {
		code: 'no_tournaments',
		message: 'No tournaments found, would you like to create one instead?',
	},
	UNAUTHORIZED: {
		code: 'invalid_auth_token',
		message: 'Unauthorized, please log in to proceed.',
	},
	UNKNOWN: {
		code: 'unknown_error',
		message: 'An unknown error occurred, try again later.',
	},
	UNSUPPORTED_ACTION: {
		code: 'unsupported_action',
		message: 'The action you have attempted is unsupported.',
	},
	duplicateError: (field, resource) => ({
		code: 'duplicate_error',
		message: `Field ${field} must be unique across ${resource}.`,
		field,
		resource,
	}),
	validationError: errors => {
		const fields = Object.keys(errors)
		const fieldsWithErrors = fields.map(field => ({
			[field]: errors[field].kind,
		}))
		return {
			code: 'validation_error',
			message: 'There was an error validating your request, check the following fields.',
			errors: fieldsWithErrors,
		}
	},
	notFound: resource => ({
		code: 'not_found',
		message: `The ${resource.toLowerCase()} you requested does not exist.`,
	}),
}
