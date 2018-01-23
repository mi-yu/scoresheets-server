import React from 'react'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import { Grid } from 'semantic-ui-react'

export default class DashboardPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			tournaments: [],
			events: [],
			user: props.user
		}
	}

	componentDidMount() {		
		const { user } = this.props
		const { tournaments, events } = this.state

		if (tournaments.length === 0 || events.length === 0) {
			const token = Auth.getToken()
			fetch('/admin/dashboard', {
				method: 'GET',
				headers: new Headers({
					'Authorization': 'Bearer ' + token
				})
			}).then(data => {
				if (data.ok)
					return data.json()
				else
					throw new Error()
			})
			.then(res => {
				this.setState({
					tournaments: res.tournaments,
					events: res.events 
				})
			})
			.catch(err => console.log(err))
		}
	}

	render() {
		const { tournaments, events, user } = this.state
		console.log(tournaments)
		console.log(events)

		if (tournaments === null || events.length === 0)
			return null

		return (
			<Grid>
				{events.map((event, i) => 
					<EventCard {...event}/>
				)}
			</Grid>
		)
	}
}