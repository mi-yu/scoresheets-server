import React, { Component } from 'react'
import { Menu, Item } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'

export default class Nav extends Component {
	state = {}

	handleClick = e => this.setState({ activeItem: e.target.name })

	handleLogout = () => {
		Auth.removeToken()
		return <Redirect to="/" />
	}

	render() {
		const { activeItem } = this.state

		return (
			<Menu attached="top" inverted={true}>
				<Item
					name="Scribe"
					active={(activeItem === 'Scribe').toString()}
					onClick={this.handleClick}
				>
					<Link to="/">Scribe</Link>
				</Item>

				{Auth.isAuthenticated() ? (
					<Menu.Menu position="right">
						<Item
							name="Dashboard"
							active={(activeItem === 'Dashboard').toString()}
							onClick={this.handleClick}
						>
							<Link to="/admin/dashboard">Dashboard</Link>
						</Item>
						<Item
							name="Profile"
							active={(activeItem === 'Profile').toString()}
							onClick={this.handleClick}
						>
							<Link to="/users/me">Profile</Link>
						</Item>
						<Item
							name="Logout"
							active={(activeItem === 'Logout').toString()}
							onClick={this.handleClick}
						>
							<Link to="/" onClick={this.handleLogout}>
								Logout
							</Link>
						</Item>
					</Menu.Menu>
				) : (
					<Menu.Menu position="right">
						<Item
							name="Login"
							active={(activeItem === 'Login').toString()}
							onClick={this.handleClick}
						>
							<Link to="/users/login">Login</Link>
						</Item>
						<Item
							name="Register"
							active={(activeItem === 'Register').toString()}
							onClick={this.handleClick}
						>
							<Link to="/users/register">Register</Link>
						</Item>
					</Menu.Menu>
				)}
			</Menu>
		)
	}
}
