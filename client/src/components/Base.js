import React from 'react';
import Nav from './Nav'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

import routes from '../routes.js'

class Base extends React.Component {
	state = {
		user: {}
	}

	setUser = (newUser) => {
		this.setState({
			user: newUser
		})
	}

	render() {
		const { user } = this.state
		return (
			<div>
				<Router>
					<div>
						<Nav user={user}/>
						<Container>
							{routes.map((route, i) => (
								<Route exact key={i} path={route.path} render={props =>(
									<route.component setUser={this.setUser} user={this.state.user} {...props} />
								)}/>
							))}
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