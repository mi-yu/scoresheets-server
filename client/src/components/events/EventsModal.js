import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'
import options from './EventsOptions'

class EventsModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			modalOpen: props.modalOpen,
			...props
		}
	}

	openModal = () => {
		this.setState({
			modalOpen: true
		})
	}

	closeModal = () => {
		this.setState({
			modalOpen: false
		})
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.modalOpen !== nextProps.modalOpen)
			this.setState({
				...nextProps,
				editingEvent: nextProps.editingEvent || {}
			})
	}

	render() {
		const { modalOpen, editingEvent, clearEditingEvent } = this.state
		return (
			<Modal
				trigger={<OpenModalButton onClick={() => clearEditingEvent()} text='New Event' icon='plus'/>} 
				closeIcon 
				open={modalOpen} 
				onClose={this.closeModal}
			>
				<Modal.Header>{editingEvent.name ? `Edit Event: ${editingEvent.name}` : 'New Event'}</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label>Name</label>
							<Form.Input required value={editingEvent.name}/>
						</Form.Field>
						<Form.Field required>
							<label>Division</label>
							<Dropdown  
								placeholder='Select division' 
								selection 
								required 
								options={options.divisions} 
								defaultValue={editingEvent.division}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Category</label>
							<Dropdown 
								placeholder='Select category' 
								selection 
								required 
								options={options.categories}
								defaultValue={editingEvent.category}
							/>
						</Form.Field>
						<Form.Field>
							<label>Resources Allowed (1 binder, 4 sheets of paper, etc)</label>
							<Form.Input type='text' value={editingEvent.resources}/>
						</Form.Field>
						<Form.Group inline>
							<Form.Checkbox label='In rotation?' checked={editingEvent.inRotation}/>
							<Form.Checkbox label='Requires impound?' checked={editingEvent.impound}/>
							<Form.Checkbox label='State/Trial event?' checked={editingEvent.stateEvent}/>
							<Form.Checkbox label='High score wins?' checked={editingEvent.highScoreWins}/>
						</Form.Group>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.closeModal}>Cancel</Button>
					<Button color='green'>Submit</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

export default EventsModal