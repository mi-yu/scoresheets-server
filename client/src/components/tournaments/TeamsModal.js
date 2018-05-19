import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'

export default class TeamsModal extends React.Component {
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
			currentTeam: {
				...this.state.currentTeam,
				[name]: value
			}
		})
	}

	handleSubmitEvent = () => {
		const { editingTeam, currentTeam, updateTeam, setMessage, tournament } = this.state
		const tournamentId = tournament._id
		const teamId = currentTeam._id
		const teamDiv = currentTeam.division
		const url = editingTeam
			? `/tournaments/${tournamentId}/edit/${teamDiv}/${teamId}`
			: `/tournaments/${tournamentId}/edit/addTeam`
		const token = Auth.getToken()

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}),
			body: JSON.stringify(currentTeam)
		})
			.then(data => {
				if (data.ok) return data.json()
				else this.closeModal()
			})
			.then(res => {
				updateTeam(currentTeam)
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
				currentTeam: nextProps.currentTeam || {}
			})
	}

	render() {
		const { modalOpen, currentTeam, clearCurrentTeam } = this.state

		return (
			<Modal
				trigger={
					<OpenModalButton
						onClick={() => clearCurrentTeam()}
						text="New Team"
						icon="plus"
					/>
				}
				closeIcon
				open={modalOpen}
				onClose={this.closeModal}
			>
				<Modal.Header>
					{currentTeam.name ? `Edit Team: ${currentTeam.name}` : 'New Team'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label>School</label>
							<Form.Input
								required
								name="school"
								value={currentTeam.school}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Division</label>
							<Form.Select
								fluid
								name="division"
								options={[{ text: 'B', value: 'B' }, { text: 'C', value: ' C' }]}
								defaultValue={currentTeam.division}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Team Number</label>
							<Form.Input
								name="teamNumber"
								value={currentTeam.events}
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
