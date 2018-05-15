import React from 'react'
import LoginForm from '../components/users/LoginForm'

const LoginPage = props => {
	console.log(props)
	return (
		<div>
			<h1> Login </h1>
			<LoginForm setUser={props.setUser} />
		</div>
	)
}

export default LoginPage
