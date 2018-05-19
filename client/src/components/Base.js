import React from 'react'
import Nav from './Nav'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'

import routes from '../routes.js'

class Base extends React.Component {
	state = {
		user: {},
		messageVisible: false,
		message: '',
		messageStatus: ''
	}

	setUser = newUser => {
		this.setState({
			user: newUser
		})
	}

	handleDismissMessage = () => {
		this.setState({
			messageVisible: false
		})
	}

	setMessage = (msg, status) => {
		this.setState({
			message: msg,
			messageStatus: status,
			messageVisible: true
		})
	}

	render() {
		const { user, message, messageStatus, messageVisible } = this.state
		const messageColor =
			messageStatus === 'info' ? 'blue' : messageStatus === 'success' ? 'green' : 'red'
		return (
			<div>
				<Router>
					<div>
						<Nav user={user} />
						<Container>
							{routes.map((route, i) => (
								<Route
									exact
									key={i}
									path={route.path}
									render={props => (
										<route.component
											setUser={this.setUser}
											setMessage={this.setMessage}
											user={user}
											{...props}
										/>
									)}
								/>
							))}
							{messageVisible && (
								<Message
									onDismiss={this.handleDismissMessage}
									content={message}
									color={messageColor}
								/>
							)}
						</Container>
					</div>
				</Router>
			</div>
		)
	}
}

Base.propTypes = {
	token: PropTypes.string,
	user: PropTypes.object
}

export default Base
