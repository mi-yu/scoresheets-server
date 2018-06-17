import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'
import LoginForm from '../components/users/LoginForm'

const LoginPage = ({ setUser }) => (
	<div>
		<Header as="h1"> Login </Header>
		<LoginForm setUser={setUser} />
	</div>
)

LoginPage.propTypes = {
	setUser: PropTypes.func.isRequired,
}

export default LoginPage
