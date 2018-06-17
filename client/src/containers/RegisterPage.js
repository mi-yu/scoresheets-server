import React from 'react'
import RegisterForm from '../components/users/RegisterForm'
import { Header } from 'semantic-ui-react'

const centered = {
	width: '50%',
	margin: '0 auto',
}

export default class RegisterPage extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div style={centered}>
				<Header as="h1">Register</Header>
				<RegisterForm />
  </div>
		)
	}
}
