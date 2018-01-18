import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth'

export default class Nav extends Component {
    state = {}

    handleClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu attached='top' inverted={true}>
                <Menu.Item name='Scribe' active={activeItem === 'Scribe'} onClick={this.handleClick}>
                    <Link to='/'>Scribe</Link>
                </Menu.Item>
                
                {Auth.isAuthenticated() ? (
                    <Menu.Menu position='right'>
                        <Menu.Item name='Dashboard' active={activeItem === 'Dashboard'} onClick={this.handleClick}>
                            <Link to='/admin/dashboard'>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item name='Profile' active={activeItem === 'Profile'} onClick={this.handleClick}>
                            <Link to='/users/me'>Profile</Link>
                        </Menu.Item>
                        <Menu.Item name='Logout' active={activeItem === 'Logout'} onClick={this.handleClick}>
                            <Link to='/users/logout'>Logout</Link>
                        </Menu.Item>
                    </Menu.Menu>
                ) : (
                    <Menu.Menu position='right'>
                        <Menu.Item name='Login' active={activeItem === 'Login'} onClick={this.handleClick}>
                            <Link to='/users/login'>Login</Link>
                        </Menu.Item>
                        <Menu.Item name='Register' active={activeItem === 'Register'} onClick={this.handleClick}>
                            <Link to='/users/register'>Register</Link>
                        </Menu.Item>
                    </Menu.Menu>
                )}
            </Menu>
        )
    }
}