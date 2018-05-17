import React from 'react'
import Auth from '../modules/Auth'
import { Redirect } from 'react-router-dom'
import { Grid, Header, Divider, Message } from 'semantic-ui-react'

export default class TournamentManagementPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirectToLogin: false
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params
		const token = Auth.getToken()

		fetch(`/tournaments/${id}/allData`, {
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
				this.setState({
					tournament: res.tournament,
					events: res.events,
					teams: res.teams,
					schools: res.schools
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true
				})
			})
	}

	render() {
		const { tournament, events, teams, schools, redirectToLogin } = this.state
		if (redirectToLogin) return <Redirect to="/users/login" />
		else if (!tournament) return null
		return <Header as="h1"> Manage {tournament.name} </Header>
	}
}
