import React from 'react'
import { Header } from 'semantic-ui-react'
import RegisterForm from '../components/users/RegisterForm'

const centered = {
	width: '50%',
	margin: '0 auto',
}

const RegisterPage = () => (
	<div style={centered}>
		<Header as="h1">Register</Header>
		<RegisterForm />
	</div>
)

export default RegisterPage
