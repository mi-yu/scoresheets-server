import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import options from './EventsOptions'
import Auth from '../../modules/Auth'

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
			currentEvent: {
				...this.state.currentEvent,
				[name]: value
			}
		})
	}

	handleCheck = (e, { name, checked }) => {
		this.setState({
			...this.state,
			currentEvent: {
				...this.state.currentEvent,
				[name]: checked
			}
		})
	}

	handleSubmitEvent = () => {
		const { editingEvent, currentEvent, updateEvent, setMessage } = this.state
		const url = editingEvent ? `/events/${currentEvent._id}/edit` : '/events/new'
		const token = Auth.getToken()

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}),
			body: JSON.stringify(currentEvent)
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
				if (res.message.success) setMessage(res.message.success, 'success')
				else setMessage(res.message.error, 'error')
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
				currentEvent: nextProps.currentEvent || {}
			})
	}

	render() {
		const { modalOpen, currentEvent, clearCurrentEvent } = this.state
		return (
			<Modal
				trigger={
					<OpenModalButton
						onClick={() => clearCurrentEvent()}
						text="New Event"
						icon="plus"
					/>
				}
				closeIcon
				open={modalOpen}
				onClose={this.closeModal}
			>
				<Modal.Header>
					{currentEvent.name ? `Edit Event: ${currentEvent.name}` : 'New Event'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label>Name</label>
							<Form.Input
								required
								name="name"
								value={currentEvent.name}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Division</label>
							<Dropdown
								placeholder="Select division"
								selection
								required
								name="division"
								options={options.divisions}
								defaultValue={currentEvent.division}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Category</label>
							<Dropdown
								placeholder="Select category"
								selection
								required
								name="category"
								options={options.categories}
								defaultValue={currentEvent.category}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<label>Resources Allowed (1 binder, 4 sheets of paper, etc)</label>
							<Form.Input
								type="text"
								name="resources"
								value={currentEvent.resources}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Group inline>
							<Form.Checkbox
								name="inRotation"
								label="In rotation?"
								checked={currentEvent.inRotation}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="impound"
								label="Requires impound?"
								checked={currentEvent.impound}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="stateEvent"
								label="State/Trial event?"
								checked={currentEvent.stateEvent}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="highScoreWins"
								label="High score wins?"
								checked={currentEvent.highScoreWins}
								onChange={this.handleCheck}
							/>
						</Form.Group>
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
