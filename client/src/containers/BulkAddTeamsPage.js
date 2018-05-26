import React from 'react'
import {
	Grid,
	Form,
	Message,
	Button,
	Icon,
	Dropdown,
	Input,
	Table,
	Header
} from 'semantic-ui-react'

const divisionOptions = [
	{
		text: 'B',
		value: 'B'
	},
	{
		text: 'C',
		value: 'C'
	}
]

export default class BulkAddTeamsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tournament: { ...props.location.state },
			numRows: 10
		}
	}

	handleAddRows = n => {
		let numRows = this.state.numRows
		numRows += n

		this.setState({
			numRows: numRows
		})
	}

	handleSubmit = () => {
		const { tournament } = this.state
		const url = `/tournaments/${tournament._id}/edit/bulkAddTeam`
	}

	render() {
		const { tournament, numRows } = this.state

		return (
			<div>
				<Header as="h1">{tournament.name}: Bulk Add Teams</Header>
				<Form>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Team Number</Table.HeaderCell>
								<Table.HeaderCell>School</Table.HeaderCell>
								<Table.HeaderCell>Identifier</Table.HeaderCell>
								<Table.HeaderCell>Division</Table.HeaderCell>
							</Table.Row>
							{[...Array(numRows)].map((r, i) => (
								<Table.Row key={i}>
									<Table.Cell>
										<Form.Input name={`teamNumber${i}`} />
									</Table.Cell>
									<Table.Cell>
										<Form.Input name={`school${i}`} />
									</Table.Cell>
									<Table.Cell>
										<Form.Input name={`identifier${i}`} />
									</Table.Cell>
									<Table.Cell>
										<Form.Dropdown
											name={`division${i}`}
											placeholder="Choose division"
											fluid
											selection
											options={divisionOptions}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Header>
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
