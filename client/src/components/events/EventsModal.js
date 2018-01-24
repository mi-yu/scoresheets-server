import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import OpenModalButton from '../modals/OpenModalButton'

const divisionOptions = [
	{
		text: 'B only',
		value: 'B'
	},
	{
		text: 'C only',
		value: 'C'
	},
	{
		text: 'B and C',
		value: 'BC'
	}
]

const categoryOptions = [
	{
		text: 'Life, Personal & Social',
		value: 'bio'
	},
	{
		text: 'Earth and Space',
		value: 'earth'
	},
	{
		text: 'Physical Science and Chemistry',
		value: 'phys/chem'
	},
	{
		text: 'Technology & Engineering',
		value: 'building'
	},
	{
		text: 'Inquiry & Nature of Science',
		value: 'inquiry'
	}
]

class EventsModal extends React.Component {
	constructor(props) {
		super(props)
		console.log(props.modalOpen)
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
		if (this.props.modalOpen !== nextProps.modalOpen)
			this.setState({
				modalOpen: nextProps.modalOpen
			})
	}

	render() {
		const { modalOpen, editingEvent } = this.state
		return (
			<Modal
				trigger={<OpenModalButton onClick={this.openModal} text='New Event' icon='plus'/>} 
				closeIcon 
				open={modalOpen} 
				onClose={this.closeModal}
			>
				<Modal.Header>{editingEvent ? 'Edit Event' : 'New Event'}</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label>Name</label>
							<Form.Input required/>
						</Form.Field>
						<Form.Field required>
							<label>Division</label>
							<Dropdown  placeholder='Select division' selection required options={divisionOptions}/>
						</Form.Field>
						<Form.Field required>
							<label>Category</label>
							<Dropdown  placeholder='Select division' selection required options={categoryOptions}/>
						</Form.Field>
						<Form.Field>
							<label>Resources Allowed (1 binder, 4 sheets of paper, etc)</label>
							<Form.Input type='text'/>
						</Form.Field>
						<Form.Group inline>
							<Form.Checkbox label='In rotation?' />
							<Form.Checkbox label='Requires impound?' />
							<Form.Checkbox label='State/Trial event?' />
							<Form.Checkbox label='High score wins?' />
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