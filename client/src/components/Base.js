import React from 'react';
import PropTypes from 'prop-types'
import Nav from './Nav'
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

import routes from '../routes.js'

const Base = ({children}) => (
	<div>
		<Router>
			<div>
				<Nav/>
				<Container>
					{routes.map((route, i) => (
						<Route exact path={route.path} component={route.component}/>
					))}
				</Container>
				{children}
			</div>
		</Router>
	</div>	
)

Base.propTypes = {
	children: PropTypes.object.isRequired
}

export default Base