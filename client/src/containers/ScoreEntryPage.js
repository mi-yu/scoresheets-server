import React from 'react'
import Auth from '../modules/Auth'
import { Header, Button, Table, Checkbox, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class ScoreEntryPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			setMessage: props.setMessage
		}
	}

	componentDidMount() {
		const { setMessage } = this.state
		const { tournamentId, eventId, division } = this.props.match.params
		const token = Auth.getToken()

		fetch(`/scoresheets/${tournamentId}/scores/${division}/${eventId}`, {
			method: 'GET',
			headers: new Headers({
				Authorization: 'Bearer ' + token
			})
		})
			.then(data => {
				if (data.ok) return data.json()
				else throw new Error()
			})
			.then(res => {
				this.setState({
					scoresheetEntry: res.scoresheetEntry,
					teams: res.teams
				})
			})
			.catch(err => {
				setMessage(err, 'error')
			})
	}

	render() {
		const { scoresheetEntry, teams } = this.state
		if (!scoresheetEntry) return null
		else
			return (
				<div>
					<Header as="h1">{scoresheetEntry.event.name}</Header>
					<Link
						className="sub header"
						to={`/tournaments/${scoresheetEntry.tournament._id}/manage`}
					>
						{scoresheetEntry.tournament.name}
					</Link>
					<Form>
						<Table celled>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell width={3}>Team (School)</Table.HeaderCell>
									<Table.HeaderCell width={2}>Raw Score</Table.HeaderCell>
									<Table.HeaderCell width={2}>Tiebreaker</Table.HeaderCell>
									<Table.HeaderCell width={2}>Tier</Table.HeaderCell>
									<Table.HeaderCell width={3}>Drops/Penalties</Table.HeaderCell>
									<Table.HeaderCell width={3}>Notes</Table.HeaderCell>
									<Table.HeaderCell>Rank</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{scoresheetEntry.scores.map((score, i) => (
									<Table.Row key={i}>
										<Table.Cell>
											{score.team.division +
												score.team.teamNumber +
												' (' +
												score.team.school +
												')'}
										</Table.Cell>
										<Table.Cell>
											<Form.Input
												name="rawScore"
												scoreIndex={i}
												fluid
												value={scoresheetEntry.scores[i].rawScore}
												onChange={this.handleChange}
											/>
										</Table.Cell>
										<Table.Cell>
											<Form.Input
												name="tiebreaker"
												scoreIndex={i}
												fluid
												value={scoresheetEntry.scores[i].tiebreaker}
												onChange={this.handleChange}
											/>
										</Table.Cell>
										<Table.Cell>
											<Form.Input
												name="tier"
												scoreIndex={i}
												fluid
												value={scoresheetEntry.scores[i].tier}
												onChange={this.handleChange}
											/>
										</Table.Cell>
										<Table.Cell>
											<Form.Group>
												<Form.Checkbox
													name="dropped"
													label="Dropped"
													width={8}
													checked={scoresheetEntry.scores[i].dropped}
												/>
												<Form.Checkbox
													name="participationOnly"
													label="PP"
													width={8}
													checked={
														scoresheetEntry.scores[i].participationOnly
													}
												/>
											</Form.Group>
											<Form.Group>
												<Form.Checkbox
													width={8}
													name="noShow"
													label="NS"
													checked={scoresheetEntry.scores[i].noShow}
												/>
												<Form.Checkbox
													width={8}
													name="dq"
													label="DQ"
													checked={scoresheetEntry.scores[i].dq}
												/>
											</Form.Group>
										</Table.Cell>
										<Table.Cell>
											<Form.TextArea
												name="notes"
												scoreIndex={i}
												fluid
												value={scoresheetEntry.scores[i].notes}
												onChange={this.handleChange}
											/>
										</Table.Cell>
										<Table.Cell>{scoresheetEntry.scores[i].rank}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						<Button type="submit" color="green">
							Save Scores
						</Button>
					</Form>
				</div>
			)
	}
}
