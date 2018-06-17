import React from 'react'
import { Form } from 'semantic-ui-react'

const roleOptions = [
	{
		text: 'Tournament Director',
		value: 'director',
	},
	{
		text: 'Event Supervisor',
		value: 'supervisor',
	},
	{
		text: 'Competitor',
		value: 'competitor',
	},
]

export default class RegisterForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			group: '',
			firstName: '',
			lastName: '',
			password: '',
		}
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			[name]: value,
		})
	}

	renderDirectorFields = () => {
		return (
			<Form.Field>
				<label htmlFor="director specific fields">Director specific fields</label>
			</Form.Field>
		)
	}

	render() {
		const { group, firstName, lastName, password } = this.state
		return (
			<Form>
				<Form.Group>
					<Form.Field width={8}>
						<label htmlFor="first name">First Name</label>
						<Form.Input
							name="firstName"
							value={firstName}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Form.Field width={8}>
						<label htmlFor="last name">Last Name</label>
						<Form.Input name="lastName" value={lastName} onChange={this.handleChange} />
					</Form.Field>
				</Form.Group>
				<Form.Field>
					<label htmlFor="group">Which role best describes you?</label>
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
}
