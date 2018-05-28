import React, { Component } from 'react'
import { Menu, Item, Container } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'

const activeStyle = {
	borderBottom: '1px solid black',
	color: 'black'
}

export default class Nav extends Component {
	constructor(props) {
		super(props)
		const url = window.location.pathname.split('/')
		this.state = {
			activeItem: url[url.length - 1]
		}
	}

	handleClick = e => this.setState({ activeItem: e.target.innerHTML.toLowerCase() })

	handleLogout = () => {
		Auth.removeToken()
		return <Redirect to="/" />
	}

	render() {
		const { activeItem } = this.state

		return (
			<Container style={{ paddingTop: '0' }}>
				<Menu
					borderless
					attached="top"
					style={{
						borderLeft: 'none',
						borderRight: 'none',
						borderTop: 'none'
					}}
					color="black"
				>
					<Item
						name="Scribe"
						onClick={this.handleClick}
						style={activeItem === 'scribe' || activeItem === '' ? activeStyle : {}}
					>
						<Link to="/">Scribe</Link>
					</Item>

					{Auth.isAuthenticated() ? (
						<Menu.Menu borderless position="right" color="black">
							<Item
								name="Dashboard"
								style={activeItem === 'dashboard' ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/admin/dashboard">Dashboard</Link>
							</Item>
							<Item
								name="Profile"
								style={activeItem === 'profile' ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/users/me">Profile</Link>
							</Item>
							<Item
								name="Logout"
								style={activeItem === 'logout' ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/" onClick={this.handleLogout}>
									Logout
								</Link>
							</Item>
						</Menu.Menu>
					) : (
						<Menu.Menu borderless position="right" color="black">
							<Item
								name="Login"
								style={activeItem === 'login' ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/users/login">Login</Link>
							</Item>
							<Item
								name="Register"
								style={activeItem === 'register' ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/users/register">Register</Link>
							</Item>
						</Menu.Menu>
					)}
				</Menu>
			</Container>
		)
	}
}
