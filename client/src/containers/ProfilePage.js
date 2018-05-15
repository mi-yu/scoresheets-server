import React from 'react'
import Auth from '../modules/Auth'
import { Redirect } from 'react-router-dom'

class ProfilePage extends React.Component {
	constructor(props) {
		super(props)
		this.setUser = props.setUser.bind(this)
		this.state = {
			redirectToLogin: false
		}
	}

	componentDidMount() {
		console.log(this.props.user)
		if (Object.keys(this.props.user).length === 0) {
			const token = Auth.getToken()
			fetch('/users/me', {
				method: 'GET',
				headers: new Headers({
					Authorization: 'Bearer ' + token
				})
			})
				.then(data => {
					if (data.ok) return data.json()
					else throw new Error()
				})
				.then(res => {
					return this.setUser(res.user)
				})
				.catch(err => {
					console.log(err)
					this.setState({
						redirectToLogin: true
					})
				})
		}
	}

	render() {
		console.log(this.props.user)
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

export default ProfilePage
