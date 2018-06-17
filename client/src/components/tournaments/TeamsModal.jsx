import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'

export default class TeamsModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.modalOpen !== nextProps.modalOpen) {
			this.setState({
				...nextProps,
				currentTeam: nextProps.currentTeam || {},
			})
		}
	}

	openModal = () => {
		this.setState({
			modalOpen: true,
		})
	}

	closeModal = () => {
		this.state.closeModalParent()
		this.setState({
			modalOpen: false,
		})
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			...this.state,
			currentTeam: {
				...this.state.currentTeam,
				[name]: value,
			},
		})
	}

	handleSubmitEvent = () => {
		const { editingTeam, currentTeam, updateTeam, setMessage, tournament, schools } = this.state
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
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify(currentTeam),
		})
			.then(data => {
				if (data.ok) return data.json()
				this.closeModal()
			})
			.then(res => {
				if (res.message.success) {
					setMessage(res.message.success, 'success')
					updateTeam(res.newTeam)
				} else setMessage(res.message.error, 'error')
				this.closeModal()
			})
			.catch(err => {
				setMessage(err, 'error')
			})
	}

	render() {
		const { modalOpen, currentTeam, clearCurrentTeam, schools } = this.state

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
					{currentTeam.school ? `Edit Team: ${currentTeam.school}` : 'New Team'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label htmlFor="school">School</label>
							<Form.Dropdown
								required
								search
								selection
								allowAdditions
								name="school"
								value={currentTeam.school}
								onChange={this.handleChange}
								options={schools.map(school => ({ text: school, value: school }))}
							/>
						</Form.Field>
						<Form.Field>
							<label htmlFor="identifier">Identifier (optional)</label>
							<small>
								Use this to distinguish between two teams from the same school (team
								A/B/C, team Red/Green, etc)
							</small>
							<Form.Input
								required
								name="identifier"
								value={currentTeam.identifier}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="division">Division</label>
							<Form.Select
								fluid
								name="division"
								options={[{ text: 'B', value: 'B' }, { text: 'C', value: 'C' }]}
								value={currentTeam.division}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="team number">Team Number</label>
							<Form.Input
								name="teamNumber"
								type="number"
								value={currentTeam.teamNumber}
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

TeamsModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	currentTeam: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		division: PropTypes.string.isRequired,
		identifier: PropTypes.string.isRequired,
		teamNumber: PropTypes.number.isRequired,
	}).isRequired,
}
