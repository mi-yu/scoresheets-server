import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
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
		const {
			editingTournament,
			currentTournament,
			updateTournament,
			setMessage,
			openModal
		} = this.state
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
				updateTournament(currentTournament)
				if (res.message.success) setMessage(res.message.success, 'success')
				else setMessage(res.message.error, 'error')
				this.closeModal()
			})
			.catch(err => {
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
		const { modalOpen, currentTournament, openModal, clearCurrentTournament } = this.state
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
								defaultValue={currentTournament.events}
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

export default TournamentsModal
