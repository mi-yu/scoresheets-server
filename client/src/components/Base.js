import React from 'react';
import Nav from './Nav'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

import routes from '../routes.js'

class Base extends React.Component {
	state = {
		token: '',
		user: {}
	}

	render() {
		const { token, user } = this.state
		return (
			<div>
				<Router>
					<div>
						<Nav token={token} user={user}/>
						<Container>
							{routes.map((route, i) => (
								<Route exact path={route.path} component={route.component}/>
							))}
						</Container>
					</div>
				</Router>
				<pre>{this.state.token}</pre>
			</div>
		)	
	}
}

Base.propTypes = {
	token: PropTypes.string,
	user: PropTypes.object
}


export default Base