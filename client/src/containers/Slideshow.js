import React from 'react'
import { Deck, Heading, List, ListItem, Slide, Text, Appear } from 'spectacle'
import Auth from '../modules/Auth'
import createTheme from 'spectacle/lib/themes/default'

const theme = createTheme(
	{
		primary: 'white',
		secondary: '#1F2022',
		tertiary: 'black',
		quarternary: '#CECECE'
	},
	{
		primary: 'Roboto'
	}
)

const getRankSuffix = n => {
	switch (n) {
		case 1:
			return '1st'
			break
		case 2:
			return '2nd'
			break
		case 3:
			return '3rd'
			break
		default:
			return n + 'th'
	}
}

export default class Slideshow extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
			numAwards: props.location.state && (props.location.state.numAwards || 4)
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params
		const token = Auth.getToken()

		fetch(`/tournaments/${id}/slideshow`, {
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
				let sweepstakes = res.topCTeams
				let n = 1
				for (let i = 0; i < res.topBTeams.length; i++) {
					sweepstakes.splice(n, 0, res.topBTeams[i])
					n += 2
				}
				this.setState({
					topTeamsPerEvent: res.topTeamsPerEvent,
					tournament: res.tournament,
					sweepstakes: sweepstakes.reverse()
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					redirectToLogin: true
				})
			})
	}

	render() {
		const { topTeamsPerEvent, sweepstakes, tournament } = this.state
		if (!topTeamsPerEvent) return null
		return (
			<Deck theme={theme} progress="none" controls={false}>
				<Slide transition={['fade']}>
					<Heading size={1}>{tournament.name} Awards</Heading>
					<Heading size={4}>{tournament.date}</Heading>
				</Slide>
				{topTeamsPerEvent.map((entry, i) => {
					return (
						<Slide key={i} transition={['fade']}>
							<Heading size={3} padding="50px">
								{entry.event.name} {entry.division}
							</Heading>
							{entry.scores.map((score, n) => {
								return (
									<Appear order={entry.scores.length - n - 1} key={n}>
										<Text textAlign="center" textFont="Roboto">
											{n + 1}. {score.team.division}
											{score.team.teamNumber} ({score.team.school}
											{score.team.identifier
												? ' ' + score.team.identifier
												: ''})
										</Text>
									</Appear>
								)
							})}
						</Slide>
					)
				})}
				{sweepstakes.map((team, i) => {
					return (
						<Slide key={team._id}>
							<Heading size={4} padding="50px">
								Sweepstakes {team.division} - {getRankSuffix(team.rank)} Place
							</Heading>
							<Appear>
								<Text textAlign="center" textSize="64px">
									{team.division}
									{team.teamNumber} ({team.school}
									{team.identifier ? ' ' + team.identifier : ''})
								</Text>
							</Appear>
						</Slide>
					)
				})}
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
