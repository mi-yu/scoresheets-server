import React from 'react'
import Auth from '../modules/Auth'
import { Redirect } from 'react-router-dom'
import { Grid, Header, Divider, Message, Button, Icon, Dropdown } from 'semantic-ui-react'
import TournamentEventCard from '../components/tournaments/TournamentEventCard.js'
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

export default class TournamentManagementPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirectToLogin: false,
			numAwards: 0,
			editingTeam: false,
			currentTeam: {},
			setMessage: props.setMessage
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

	closeModalParent = () => {
		this.setState({
			editingTeam: false,
			teamModalOpen: false
		})
	}

	setMessage = (msg, status) => {
		this.setState({
			message: msg,
			messageStatus: status,
			messageVisible: true
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
			currentTeam
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
						primary
						options={awardsOptions}
						onChange={this.handleChange}
						value={numAwards}
					/>
					<Button primary icon labelPosition="right">
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
					clearCurrentTeam={this.clearCurrentTeam}
				/>
				<Header as="h2">Events</Header>
				<Grid>
					{tournament.events.map(event => (
						<TournamentEventCard key={event._id} {...event} />
					))}
				</Grid>
			</div>
		)
	}
}
