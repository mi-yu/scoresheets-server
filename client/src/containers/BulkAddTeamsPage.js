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

export default class BulkAddTeamsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tournament: { ...props.location.state }
		}
	}

	render() {
		const { tournament } = this.state
		let rows = []
		for (let i = 0; i < 20; i++) {
			rows.push(
				<Table.Row>
					<Table.Cell>
						<Form.Input />
					</Table.Cell>
					<Table.Cell>
						<Form.Input />
					</Table.Cell>
					<Table.Cell>
						<Form.Input />
					</Table.Cell>
					<Table.Cell>
						<Form.Input />
					</Table.Cell>
				</Table.Row>
			)
		}
		return (
			<div>
				<Header as="h1">{this.state.tournament.name}: Bulk Add Teams</Header>
				<Form>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Team Number</Table.HeaderCell>
								<Table.HeaderCell>School</Table.HeaderCell>
								<Table.HeaderCell>Identifier</Table.HeaderCell>
								<Table.HeaderCell>Division</Table.HeaderCell>
							</Table.Row>
							{rows}
						</Table.Header>
					</Table>
				</Form>
			</div>
		)
	}
}
