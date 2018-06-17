import React from 'react'
import PropTypes from 'prop-types'
import createTheme from 'spectacle/lib/themes/default'
import { Deck, Heading, Slide, Text, Appear } from 'spectacle'
import Auth from '../modules/Auth'

const theme = createTheme(
	{
		primary: 'white',
		secondary: '#1F2022',
		tertiary: 'black',
		quarternary: '#CECECE',
	},
	{
		primary: 'Roboto',
	},
)

const getRankSuffix = n => {
	switch (n) {
		case 1:
			return '1st'
		case 2:
			return '2nd'
		case 3:
			return '3rd'
		default:
			return `${n}th`
	}
}

export default class Slideshow extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
			numAwards: props.location.state && (props.location.state.numAwards || 4),
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params
		const { setMessage } = this.props
		const token = Auth.getToken()

		fetch(`/tournaments/${id}/slideshow`, {
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
				const sweepstakes = res.topCTeams
				let n = 1
				for (let i = 0; i < res.topBTeams.length; i += 1) {
					sweepstakes.splice(n, 0, res.topBTeams[i])
					n += 2
				}
				this.setState({
					topTeamsPerEvent: res.topTeamsPerEvent,
					tournament: res.tournament,
					sweepstakes: sweepstakes.reverse(),
				})
			})
			.catch(err => {
				setMessage(err, 'error')
			})
	}

	render() {
		const { topTeamsPerEvent, sweepstakes, tournament } = this.state
		if (!topTeamsPerEvent) return null
		return (
			<Deck theme={theme} progress="none" controls={false}>
				<Slide transition={['fade']}>
					<Heading size={1}>{tournament.name} Awards</Heading>
					<Heading size={4}>{new Date(tournament.date).toLocaleDateString()}</Heading>
				</Slide>
				{topTeamsPerEvent.map(entry => (
					<Slide transition={['fade']}>
						<Heading size={3} padding="50px">
							{entry.event.name} {entry.division}
						</Heading>
						{entry.scores.map((score, n) => (
							<Appear order={entry.scores.length - n - 1}>
								<Text textAlign="center" textFont="Roboto">
									{n + 1}. {score.team.division}
									{score.team.teamNumber} ({score.team.school}
									{score.team.identifier ? ` ${score.team.identifier}` : ''})
								</Text>
							</Appear>
						))}
					</Slide>
				))}
				{sweepstakes.map(team => (
					<Slide key={team._id}>
						<Heading size={4} padding="50px">
							Sweepstakes {team.division} - {getRankSuffix(team.rank)} Place
						</Heading>
						<Appear>
							<Text textAlign="center" textSize="64px">
								{team.division}
								{team.teamNumber} ({team.school}
								{team.identifier ? ` ${team.identifier}` : ''})
							</Text>
						</Appear>
					</Slide>
				))}
				<Slide>
					<Heading size={3} padding="50px">
						Thanks for coming!
					</Heading>
					<Text textAlign="center">
						Visit scribbl.io/tournamentName/results for full results.
					</Text>
				</Slide>
			</Deck>
		)
	}
}

Slideshow.propTypes = {
	location: PropTypes.shape({
		state: PropTypes.object.isRequired,
	}),
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
	setMessage: PropTypes.func.isRequired,
}

Slideshow.defaultProps = {
	location: undefined,
	match: undefined,
}
