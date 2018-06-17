import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'

class ProfilePage extends React.Component {
	constructor(props) {
		super(props)
		this.setUser = props.setUser.bind(this)
		this.state = {
			redirectToLogin: false,
		}
	}

	componentDidMount() {
		if (Object.keys(this.props.user).length === 0) {
			const token = Auth.getToken()
			fetch('/users/me', {
				method: 'GET',
				headers: new Headers({
					Authorization: `Bearer ${token}`,
				}),
			})
				.then(data => {
					if (data.ok) return data.json()
					throw new Error()
				})
				.then(res => this.setUser(res.user))
				.catch(err => {
					console.log(err)
					this.setState({
						redirectToLogin: true,
					})
				})
		}
	}

	render() {
		const { user } = this.props

		if (!user || this.state.redirectToLogin) return <Redirect to="/users/login" />

		return (
			<div>
				<h1>id: {user._id}</h1>
				<h1>Name: {user.name}</h1>
				<h1>Email: {user.email}</h1>
			</div>
		)
	}
}

ProfilePage.propTypes = {
	setUser: PropTypes.func.isRequired,
	user: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
	}).isRequired,
}

export default ProfilePage
