import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Icon, Table, Header } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'
import Auth from '../modules/Auth'

const divisionOptions = [
	{
		text: 'B',
		value: 'B',
	},
	{
		text: 'C',
		value: 'C',
	},
]

export default class BulkAddTeamsPage extends React.Component {
	constructor(props) {
		super(props)
		const formData = []
		for (let i = 0; i < 10; i += 1) {
			formData.push({
				teamNumber: undefined,
				tournament: props.location.state.tournament._id,
				school: '',
				identifier: '',
				division: '',
			})
		}
		this.state = {
			tournament: { ...props.location.state.tournament },
			schools: props.location.state.schools.map(school => ({ text: school, value: school })),
			setMessage: props.setMessage,
			redirectToManagePage: false,
			options: divisionOptions,
			formData,
		}
	}

	handleAddRows = n => {
		const newRows = []
		for (let i = 0; i < n; i += 1) {
			newRows.push({
				teamNumber: undefined,
				tournament: this.state.tournament._id,
				school: '',
				identifier: '',
				division: '',
			})
		}

		this.setState({
			formData: this.state.formData.concat(newRows),
		})
	}

	handleChange = (e, { row, name, value }) => {
		const { formData } = this.state
		let changedRow = formData[row]
		changedRow = {
			...changedRow,
			[name]: value,
		}
		formData[row] = changedRow
		this.setState({
			formData,
		})
	}

	handleAddition = (e, { value }) => {
		this.setState({
			options: [{ text: value, value }, ...this.state.options],
		})
	}

	validateRow = row => row.teamNumber !== 0 && row.school !== '' && row.division !== ''

	handleSubmit = () => {
		const { tournament, setMessage, formData } = this.state
		const url = `/tournaments/${tournament._id}/edit/bulkAddTeams`
		const token = Auth.getToken()

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify(formData.filter(row => this.validateRow(row))),
		})
			.then(data => {
				if (data.ok) return data.json()
				throw new Error('An unknown error occurred while trying to create teams.')
			})
			.then(res => {
				if (res.message.success) {
					setMessage(res.message.success, 'success')
					this.setState({
						redirectToManagePage: res.redirect,
					})
				} else setMessage(res.message.error, 'error')
			})
			.catch(err => {
				setMessage(`An unknown error occurred: ${err.toString()}`, 'error')
			})

		// TODO: better error handling
	}

	render() {
		const { tournament, formData, redirectToManagePage, schools, options } = this.state

		if (redirectToManagePage) return <Redirect to={`/tournaments/${tournament._id}/manage`} />

		return (
			<div>
				<Header as="h1">Bulk Add Teams</Header>
				<Header color="blue">
					<Link to={`/tournaments/${tournament._id}/manage`}>
						<Icon name="long arrow left" />
						{tournament.name}
					</Link>
				</Header>
				<Form>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell width={2}>Team Number</Table.HeaderCell>
								<Table.HeaderCell width={8}>School</Table.HeaderCell>
								<Table.HeaderCell width={3}>Identifier</Table.HeaderCell>
								<Table.HeaderCell width={3}>Division</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{formData.map((r, i) => (
								<Table.Row key={i}>
									<Table.Cell>
										<Form.Input
											name="teamNumber"
											row={i}
											fluid
											value={formData[i].teamNumber}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Dropdown
											required
											row={i}
											search
											selection
											allowAdditions
											name="school"
											value={formData[i].school}
											onChange={this.handleChange}
											onAddItem={this.handleAddition}
											options={options}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											name="identifier"
											row={i}
											fluid
											value={formData[i].identifier}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Dropdown
											name="division"
											row={i}
											placeholder="Choose division"
											fluid
											selection
											options={divisionOptions}
											value={formData[i].division}
											onChange={this.handleChange}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Form>
				<Button
					icon
					primary
					onClick={() => this.handleAddRows(1)}
					className="padded-button"
				>
					<Icon name="plus" />
					Add 1 More
				</Button>
				<Button
					icon
					primary
					onClick={() => this.handleAddRows(10)}
					className="padded-button"
				>
					<Icon name="plus" />
					Add 10 More
				</Button>
				<Button color="green" className="padded-button" onClick={this.handleSubmit}>
					Submit
				</Button>
			</div>
		)
	}
}

BulkAddTeamsPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
	location: PropTypes.shape({
		state: PropTypes.object.isRequired,
	}),
}

BulkAddTeamsPage.defaultProps = {
	location: undefined,
}
