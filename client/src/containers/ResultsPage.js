import React from 'react'
import { Button, Icon, Table, Header } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'
import Auth from '../modules/Auth'

export default class ResultsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
			division: props.match.params.division,
			tournament: { ...props.location.state.tournament },
		}
	}

	componentDidMount() {
		const { tournament, division } = this.state
		const token = Auth.getToken()

		fetch(`/tournaments/${tournament._id}/${division}/results`, {
			method: 'GET',
			headers: new Headers({
				Authorization: `Bearer ${token}`,
			}),
		})
			.then(data => {
				if (data.ok) return data.json()
				throw new Error()
			})
			.then(res => {
				this.setState({
					entries: res.entries,
					teams: res.teams,
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true,
				})
			})
	}

	render() {
		const {
			entries, tournament, division, teams,
		} = this.state
		if (!entries) return null
		return (
			<div>
				<Header as="h1">Division {division} Results</Header>
    <Header color="blue">
					<Link to={`/tournaments/${tournament._id}/manage`}>
        <Icon name="long arrow left" />
        {tournament.name}
					</Link>
  </Header>
				<Table celled collapsing size="small" compact>
    <Table.Header>
        <Table.Row>
  <Table.HeaderCell verticalAlign="bottom">
								Team (School)
       </Table.HeaderCell>
							{entries.map(entry => (
            <Table.HeaderCell key={entry._id}>
  <div className="column-header">{entry.event.name}</div>
</Table.HeaderCell>
							))}
  <Table.HeaderCell verticalAlign="bottom">Total</Table.HeaderCell>
							<Table.HeaderCell verticalAlign="bottom">Rank</Table.HeaderCell>
						</Table.Row>
      </Table.Header>
    <Table.Body>
        {teams.map(team => (
							<Table.Row key={team._id}>
            <Table.Cell>
        {team.division}
        {team.teamNumber}{' '}
        {team.school +
											(team.identifier ? ` ${team.identifier}` : '')}
      </Table.Cell>
								{team.scores.map((score, i) => <Table.Cell key={i}>{score}</Table.Cell>)}
								<Table.Cell>{team.totalScore}</Table.Cell>
								<Table.Cell>{team.rank}</Table.Cell>
							</Table.Row>
						))}
      </Table.Body>
				</Table>
  </div>
		)
	}
}
