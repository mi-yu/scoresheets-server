import React from 'react'
import LoginForm from '../components/users/LoginForm'
import { Header } from 'semantic-ui-react'

const LoginPage = ({ setUser }) => {
	return (
		<div>
			<Header as="h1"> Login </Header>
			<LoginForm setUser={setUser} />
		</div>
	)
}

export default LoginPage
