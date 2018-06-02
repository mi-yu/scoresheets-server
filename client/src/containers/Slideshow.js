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
		primary: 'Montserrat',
		secondary: 'Helvetica'
	}
)

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
				this.setState({
					...res
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
		const { topTeamsPerEvent, topBTeams, topCTeams, tournament } = this.state
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
			</Deck>
		)
	}
}
