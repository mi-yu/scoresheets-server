import React from 'react'
import { Card, Label, Button, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const TournamentEventCard = ({
	_id,
	name,
	category,
	stateEvent,
	impound,
	division,
	finished,
	tournamentId
}) => {
	let color = ''
	switch (category) {
		case 'bio':
			color = 'green'
			break
		case 'earth':
			color = 'brown'
			break
		case 'inquiry':
			color = 'pink'
			break
		case 'phys/chem':
			color = 'violet'
			break
		case 'building':
			color = 'orange'
			break
		default:
			color = 'grey'
			break
	}

	return (
		<Grid.Column width={4}>
			<Card>
				<Card.Content>
					<Card.Header>{name}</Card.Header>
					<Card.Description>
						<Label size="tiny" color={color}>
							{category}
						</Label>
						{division.split('').map((div, i) => (
							<Label size="tiny" key={i}>
								{div}
							</Label>
						))}
						<Label size="tiny" color={finished ? 'green' : 'grey'}>
							{finished ? 'finished' : 'in progress'}
						</Label>
					</Card.Description>
				</Card.Content>
				<Card.Content>
					{division !== 'BC' ? (
						<Button
							fluid
							basic
							as={Link}
							to={`/scoresheets/${tournamentId}/scores/${division}/${_id}`}
						>
							Manage Scores
						</Button>
					) : (
						<Button.Group fluid basic>
							<Button
								color="blue"
								as={Link}
								to={`/scoresheets/${tournamentId}/scores/B/${_id}`}
							>
								B Scores
							</Button>
							<Button
								color="blue"
								as={Link}
								to={`/scoresheets/${tournamentId}/scores/C/${_id}`}
							>
								C Scores
							</Button>
						</Button.Group>
					)}
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

export default TournamentEventCard
