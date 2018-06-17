import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import EventsModal from '../components/events/EventsModal'
import TournamentsModal from '../components/tournaments/TournamentsModal'

export default class DashboardPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			tournaments: [],
			events: [],
			redirectToLogin: false,
			eventsModalOpen: false,
			tournamentsModalOpen: false,
			editingEvent: false,
			editingTournament: false,
			currentEvent: {},
			currentTournament: {},
			setMessage: props.setMessage,
		}
	}

	componentDidMount() {
		const { tournaments, events } = this.state

		if (tournaments.length === 0 || events.length === 0) {
			const token = Auth.getToken()
			fetch('/admin/dashboard', {
				method: 'GET',
				headers: new Headers({
					Authorization: `Bearer ${token}`,
				}),
			})
				.then(data => {
					if (data.ok) return data.json()
					throw new Error()
				})
				.then(res => {
					this.setState({
						tournaments: res.tournaments,
						events: res.events,
					})
				})
				.catch(err => {
					console.log(err)
					this.setState({
						redirectToLogin: true,
					})
				})
		}
	}

	setCurrentEvent = (e, id) => {
		const nextCurrentEvent = this.state.events.find(event => event._id === id)
		this.setState({
			currentEvent: nextCurrentEvent,
			eventsModalOpen: true,
			editingEvent: true,
		})
	}

	setCurrentTournament = (e, id) => {
		const tournament = this.state.tournaments.find(t => t._id === id)
		this.setState({
			currentTournament: tournament,
			tournamentsModalOpen: true,
			editingTournament: true,
		})
	}

	clearCurrentEvent = () => {
		this.setState({
			currentEvent: {},
			eventsModalOpen: true,
			editingEvent: false,
		})
	}

	clearCurrentTournament = () => {
		this.setState({
			currentTournament: {},
			editingTournament: false,
			tournamentsModalOpen: true,
		})
	}

	updateEvent = updatedEvent => {
		const { events } = this.state
		const index = events.map(event => event._id).indexOf(updatedEvent._id)
		if (index > -1) events[index] = updatedEvent
		else events.push(updatedEvent)
		this.setState({
			events,
		})
	}

	updateTournament = updated => {
		const { tournaments } = this.state
		const index = tournaments.map(t => t._id).indexOf(updated._id)
		if (index > -1) tournaments[index] = updated
		else tournaments.push(updated)
		this.setState({
			tournaments,
		})
	}

	closeModalParent = () => {
		this.setState({
			eventsModalOpen: false,
			tournamentsModalOpen: false,
			editingEvent: false,
			editingTournament: false,
		})
	}

	render() {
		const {
			tournaments,
			events,
			redirectToLogin,
			currentEvent,
			eventsModalOpen,
			tournamentsModalOpen,
			editingEvent,
			editingTournament,
			currentTournament,
			setMessage,
		} = this.state

		if (redirectToLogin) return <Redirect to="/users/login" />
		else if (tournaments === null || events.length === 0) return null

		return (
			<div>
				<Header as="h1">Tournaments</Header>
				<TournamentsModal
					currentTournament={{ ...currentTournament }}
					editingTournament={editingTournament}
					modalOpen={tournamentsModalOpen}
					clearCurrentTournament={this.clearCurrentTournament}
					updateTournament={this.updateTournament}
					setMessage={setMessage}
					closeModalParent={this.closeModalParent}
					events={events}
				/>
				<Grid>
					{tournaments.map(tournament => (
						<TournamentCard
							key={tournament._id}
							{...tournament}
							setCurrentTournament={this.setCurrentTournament}
						/>
					))}
				</Grid>
				<Divider />

				<Header as="h1">2017-18 Season Events</Header>
				<EventsModal
					currentEvent={{ ...currentEvent }}
					editingEvent={editingEvent}
					modalOpen={eventsModalOpen}
					clearCurrentEvent={this.clearCurrentEvent}
					updateEvent={this.updateEvent}
					setMessage={setMessage}
					closeModalParent={this.closeModalParent}
				/>
				<Grid>
					{events.map(event => (
						<EventCard
							key={event._id}
							{...event}
							setCurrentEvent={this.setCurrentEvent}
						/>
					))}
				</Grid>
			</div>
		)
	}
}

DashboardPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
}
