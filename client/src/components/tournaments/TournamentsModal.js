import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'
import states from './StatesList.js'

class EventsModal extends React.Component {
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
		const { editingEvent, currentTournament, updateEvent, setMessage } = this.state
		const url = editingEvent ? `/events/${currentTournament._id}/edit` : '/events/new'
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
				else {
					console.log(data)
					throw new Error()
				}
			})
			.then(res => {
				updateEvent(res.updatedEvent)
				setMessage(res.message.success)
				this.closeModal()
			})
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true
				})
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
		const { modalOpen, currentTournament, clearCurrentTournament, events } = this.state
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
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Date</label>
							<Form.Input
								type="date"
								name="date"
								value={currentTournament.date}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Events</label>
							<Dropdown
								placeholder="Choose events"
								selection
								multiple
								search
								name="events"
								options={events}
								onChange={this.handleChange}
							/>
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

export default EventsModal
