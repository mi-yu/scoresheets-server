import React from 'react'
import { Form } from 'semantic-ui-react'
import Auth from '../../modules/Auth'

const roleOptions = [
	{
		text: 'Tournament Director',
		value: 'director'
	},
	{
		text: 'Event Supervisor',
		value: 'supervisor'
	},
	{
		text: 'Competitor',
		value: 'competitor'
	}
]

export default class RegisterForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			group: '',
			firstName: '',
			lastName: '',
			password: ''
		}
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			[name]: value
		})
	}

	render() {
		const { group, firstName, lastName, password } = this.state
		return (
			<Form>
				<Form.Group>
					<Form.Field width={8}>
						<label>First Name</label>
						<Form.Input
							name="firstName"
							value={firstName}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Form.Field width={8}>
						<label>Last Name</label>
						<Form.Input name="lastName" value={lastName} onChange={this.handleChange} />
					</Form.Field>
				</Form.Group>
				<Form.Field>
					<label>Which role best describes you?</label>
					<Form.Dropdown
						selection
						name="group"
						value={group}
						options={roleOptions}
						onChange={this.handleChange}
					/>
				</Form.Field>
				{group === 'director' && this.renderDirectorFields()}
			</Form>
		)
	}

	renderDirectorFields = () => {
		return (
			<Form.Field>
				<label>Director specific fields</label>
			</Form.Field>
		)
	}
}
