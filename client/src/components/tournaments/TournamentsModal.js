import React from 'react'
import { Button, Modal, Form, Dropdown, Icon } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'
import states from './StatesList.js'

class TournamentsModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props
		}
	}

	openModal = () => {
		this.setState({
			modalOpen: true
		})
	}

	closeModal = () => {
		this.state.closeModalParent()
		this.setState({
			modalOpen: false
		})
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			...this.state,
			currentTournament: {
				...this.state.currentTournament,
				[name]: value
			}
		})
	}

	handleCheck = (e, { name, checked }) => {
		this.setState({
			...this.state,
			currentTournament: {
				...this.state.currentTournament,
				[name]: checked
			}
		})
	}

	handleSubmitEvent = () => {
		const { editingTournament, currentTournament, updateTournament, setMessage } = this.state
		const url = editingTournament
			? `/tournaments/${currentTournament._id}/edit`
			: '/tournaments/new'
		const token = Auth.getToken()

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}),
			body: JSON.stringify(currentTournament)
		})
			.then(data => {
				if (data.ok) return data.json()
				else this.closeModal()
			})
			.then(res => {
				if (res.message.success) {
					setMessage(res.message.success, 'success')
					updateTournament(currentTournament)
				} else setMessage(res.message.error, 'error')
				this.closeModal()
			})
			.catch(err => {
				this.setState({
					redirectToLogin: true
				})
			})
	}

	handleQuickAddEvent = key => {
		const { events } = this.state
		let newEvents = events
		switch (key) {
			case 0: // only B events
				newEvents = events.filter(
					event => event.division.includes('B') && !event.stateEvent
				)
				break
			case 1: // only C events
				newEvents = events.filter(
					event => event.division.includes('C') && !event.stateEvent
				)
				break
			case 2: // B events + trials
				newEvents = events.filter(event => event.division.includes('B'))
				break
			case 3: // C events + trials
				newEvents = events.filter(event => event.division.includes('C'))
				break
			case 4: // only B/C events
				newEvents = events.filter(event => !event.stateEvent)
				break
			case 5:
			default:
				break
		}

		newEvents = newEvents.map(event => event._id)

		this.setState({
			currentTournament: {
				...this.state.currentTournament,
				events: newEvents
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.modalOpen !== nextProps.modalOpen)
			this.setState({
				...nextProps,
				currentTournament: nextProps.currentTournament || {}
			})
	}

	render() {
		const { modalOpen, currentTournament, clearCurrentTournament } = this.state
		let eventsOptions = []

		if (this.state.events) {
			eventsOptions = this.state.events.map(event => {
				return {
					text: event.name,
					value: event._id
				}
			})
		}

		return (
			<Modal
				trigger={
					<OpenModalButton
						onClick={() => clearCurrentTournament()}
						text="New Tournament"
						icon="plus"
					/>
				}
				closeIcon
				open={modalOpen}
				onClose={this.closeModal}
			>
				<Modal.Header>
					{currentTournament.name
						? `Edit Tournament: ${currentTournament.name}`
						: 'New Tournament'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label>Tournament Name</label>
							<Form.Input
								required
								name="name"
								value={currentTournament.name}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>City</label>
							<Form.Input
								required
								name="city"
								value={currentTournament.city}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>State</label>
							<Dropdown
								placeholder="Select state"
								selection
								search
								name="state"
								options={states}
								defaultValue={currentTournament.state}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Date</label>
							<Form.Input type="date" name="date" onChange={this.handleChange} />
						</Form.Field>
						<Form.Field required>
							<label>Events</label>
							<Dropdown
								placeholder="Choose events"
								selection
								multiple
								search
								name="events"
								options={eventsOptions}
								value={currentTournament.events}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(0)}
							>
								<Icon name="plus" />
								B events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(1)}
							>
								<Icon name="plus" />
								C events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(2)}
							>
								<Icon name="plus" />
								B events + trials
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(3)}
							>
								<Icon name="plus" />
								C events + trials
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(4)}
							>
								<Icon name="plus" />
								B/C events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(5)}
							>
								<Icon name="plus" />
								B/C events + trials
							</Button>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.closeModal}>Cancel</Button>
					<Button color="green" onClick={this.handleSubmitEvent}>
						Submit
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

export default TournamentsModal
