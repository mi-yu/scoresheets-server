import React from 'react'
import PropTypes from 'prop-types'

const ErrorPage = ({ error }) => <h1>There was an error: {error.message}</h1>

ErrorPage.propTypes = {
	error: PropTypes.shape({
		message: PropTypes.string.isRequired,
	}).isRequired,
}

export default ErrorPage
