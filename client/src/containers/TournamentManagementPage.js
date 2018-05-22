import React from 'react'
import Auth from '../modules/Auth'
import { Redirect, Link } from 'react-router-dom'
import { Grid, Header, Divider, Message, Button, Icon, Dropdown, Input } from 'semantic-ui-react'
import TournamentEventCard from '../components/tournaments/TournamentEventCard.js'
import TeamCard from '../components/tournaments/TeamCard.js'
import TeamsModal from '../components/tournaments/TeamsModal.js'

const awardsOptions = [
	{
		text: '3',
		value: 3
	},
	{
		text: '4',
		value: 4
	},
	{
		text: '5',
		value: 5
	},
	{
		text: '6',
		value: 6
	}
]

const bulkAddStyle = {
	marginLeft: '4px'
}

export default class TournamentManagementPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirectToLogin: false,
			numAwards: 0,
			editingTeam: false,
			currentTeam: {},
			setMessage: props.setMessage,
			eventFilter: ''
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params
		const token = Auth.getToken()

		fetch(`/tournaments/${id}/allData`, {
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
					tournament: res.tournament,
					events: res.events,
					teams: res.teams,
					schools: res.schools
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true
				})
			})
	}

	handleChange = (e, { name, value }) => this.setState({ [name]: value })

	clearCurrentTeam = () => {
		this.setState({
			currentTeam: {},
			editingTeam: false,
			teamModalOpen: true
		})
	}

	setCurrentTeam = (e, id) => {
		const team = this.state.teams.find(t => t._id === id)
		this.setState({
			editingTeam: true,
			currentTeam: team,
			teamModalOpen: true
		})
	}

	updateTeam = updatedTeam => {
		const teams = this.state.teams
		const index = teams.map(team => team._id).indexOf(updatedTeam._id)
		if (index > -1) teams[index] = updatedTeam
		else teams.push(updatedTeam)
		this.setState({
			teams
		})
	}

	closeModalParent = () => {
		this.setState({
			editingTeam: false,
			teamModalOpen: false
		})
	}

	handleFilterEvents = (e, { value }) => {
		this.setState({
			eventFilter: value.toLowerCase()
		})
	}

	render() {
		const {
			tournament,
			teams,
			schools,
			redirectToLogin,
			numAwards,
			teamModalOpen,
			editingTeam,
			currentTeam,
			eventFilter
		} = this.state
		if (redirectToLogin) return <Redirect to="/users/login" />
		else if (!tournament) return null
		return (
			<div>
				<Header as="h1"> {tournament.name} </Header>
				<p> {new Date(tournament.date).toLocaleDateString()} </p>
				<p>
					{' '}
					{tournament.city}, {tournament.state}{' '}
				</p>
				<Button primary>
					<Icon name="trophy" />
					B Results
				</Button>
				<Button primary>
					<Icon name="trophy" />
					C Results
				</Button>
				<Button.Group>
					<Dropdown
						button
						text={numAwards || 'Choose number of awards'}
						name="numAwards"
						options={awardsOptions}
						onChange={this.handleChange}
						value={numAwards}
					/>
					<Button icon primary labelPosition="right">
						Start Awards Presentation <Icon name="right arrow" />
					</Button>
				</Button.Group>
				<Divider />
				<Header as="h2">Teams</Header>
				<TeamsModal
					currentTeam={currentTeam}
					tournament={tournament}
					editingTeam={editingTeam}
					modalOpen={teamModalOpen}
					closeModalParent={this.closeModalParent}
					updateTeam={this.updateTeam}
					clearCurrentTeam={this.clearCurrentTeam}
					setMessage={this.state.setMessage}
				/>
				<Button
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/edit/bulkAddTeams`,
						state: { ...tournament }
					}}
					style={bulkAddStyle}
					color="green"
				>
					<Icon name="plus" />
					<Icon name="zip" />
					Bulk Add Teams
				</Button>
				<Header as="h3">B Teams</Header>
				<Grid>
					{teams.length &&
						teams.map(team => {
							if (team.division === 'B')
								return <TeamCard key={team._id} team={team} />
						})}
				</Grid>
				<Header as="h3">C Teams</Header>
				<Grid>
					{teams.length &&
						teams.map(team => {
							if (team.division === 'C')
								return <TeamCard key={team._id} team={team} />
						})}
				</Grid>
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">Events</Header>
					</Grid.Column>
					<Grid.Column floated="right" width={4} textAlign="right">
						<Input
							name="eventFilter"
							placeholder="Filter events..."
							icon="search"
							onChange={this.handleFilterEvents}
						/>
					</Grid.Column>
				</Grid>
				<Grid>
					{tournament.events.map(event => {
						if (
							event.name.toLowerCase().includes(eventFilter) ||
							event.category.toLowerCase().includes(eventFilter)
						)
							return <TournamentEventCard key={event._id} {...event} />
					})}
				</Grid>
			</div>
		)
	}
}
