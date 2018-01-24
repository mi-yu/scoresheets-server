import React from 'react'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import { Grid, Header, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import EventsModal from '../components/events/EventsModal'

export default class DashboardPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			tournaments: [],
			events: [],
			user: props.user,
			redirectToLogin: false,
			eventsModalOpen: false,
			editingEvent: {}
		}
	}

	componentDidMount() {
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
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true
				})
			})
		}
	}

	setEditingEvent = (e, id) => {
		const event = this.state.events.find(event => event._id === id)
		this.setState({
			editingEvent: event,
			eventsModalOpen: true
		})
	}

	render() {
		const { tournaments, events, redirectToLogin, editingEvent, eventsModalOpen } = this.state

		if (redirectToLogin)
			return (
				<Redirect to='/users/login'/>
			)
		
		else if (tournaments === null || events.length === 0)
			return null


		return (
			<div>
				<Header as='h1'>Tournaments</Header>
				<Grid>
					{tournaments.map(event => 
						<TournamentCard key={event._id} {...event}/>
					)}
				</Grid>
				<Divider/>

				<Header as='h1'>2017-18 Season Events</Header>
				<EventsModal {...editingEvent} modalOpen={eventsModalOpen}/>
				<Grid>
					{events.map(event => 
						<EventCard 
							key={event._id} 
							{...event} 
							setEditingEvent={this.setEditingEvent}
						/>
					)}
				</Grid>
			</div>
		)
	}
}