import React from 'react'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import { Grid, Header, Divider, Message } from 'semantic-ui-react'
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
			editingEvent: false,
			message: '',
			messageVisible: false,
			currentEvent: {}
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

	setCurrentEvent = (e, id) => {
		const event = this.state.events.find(event => event._id === id)
		this.setState({
			currentEvent: event,
			eventsModalOpen: true,
			editingEvent: true
		})
	}

	clearCurrentEvent = () => {
		this.setState({
			currentEvent: {},
			eventsModalOpen: true,
			editingEvent: false
		})
	}

	updateEvent = (updatedEvent) => {
		const events = this.state.events
		const index = events.map(event => event._id).indexOf(updatedEvent._id)
		events[index] = updatedEvent
		console.log(this.state.events[index])
		this.setState({
			events
		})
	}

	setMessage = (msg) => {
		this.setState({
			message: msg,
			messageVisible: true
		})
	}

	handleDismissMessage = () => {
		this.setState({
			messageVisible: false
		})
	}

	closeModalParent = () => {
		this.setState({
			eventsModalOpen: false
		})
	}

	render() {
		const { 
			tournaments, 
			events, 
			redirectToLogin, 
			currentEvent, 
			eventsModalOpen, 
			message, 
			messageVisible, 
			editingEvent 
		} = this.state

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
				<Divider/>
				<EventsModal 
					currentEvent={{...currentEvent}} 
					editingEvent={editingEvent} 
					modalOpen={eventsModalOpen} 
					clearCurrentEvent={this.clearCurrentEvent}
					updateEvent={this.updateEvent}
					setMessage={this.setMessage}
					closeModalParent={this.closeModalParent}
				/>
				<Grid>
					{events.map(event => 
						<EventCard 
							key={event._id} 
							{...event} 
							setCurrentEvent={this.setCurrentEvent}
						/>
					)}
				</Grid>
				{messageVisible && (
					<Message
						onDismiss={this.handleDismissMessage}
						content={message}
					/>
				)}
			</div>
		)
	}
}