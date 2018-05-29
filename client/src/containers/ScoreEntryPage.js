import React from 'react'
import Auth from '../modules/Auth'
import { Button, Table } from 'semantic-ui-react'

export default class ScoreEntryPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			setMessage: props.setMessage
		}
	}

	componentDidMount() {
		const { setMessage } = this.state
		const { tournamentId, eventId, division } = this.props.match.params
		const token = Auth.getToken()

		fetch(`/scoresheets/${tournamentId}/scores/${division}/${eventId}`, {
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
					scoresheetEntry: res.scoresheetEntry,
					teams: res.teams
				})
			})
			.catch(err => {
				setMessage(err, 'error')
			})
	}

	render() {
		const { scoresheetEntry, teams } = this.state
		if (!scoresheetEntry) return null
		else {
			console.log(scoresheetEntry.scores)
			return <pre>{JSON.stringify(scoresheetEntry.scores)}</pre>
		}
	}
}
