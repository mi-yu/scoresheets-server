import React from 'react'
import Auth from '../../modules/Auth'
import { Card, Label, Button, Grid } from 'semantic-ui-react'

const TournamentCard = ({ _id, name, city, state, date, setCurrentTournament }) => (
	<Grid.Column width={4}>
		<Card>
			<Card.Content>
				<Card.Header>{name}</Card.Header>
				<Card.Meta>
					{city}, {state} on {date}
				</Card.Meta>
			</Card.Content>
			<Card.Content extra>
				<Button fluid color="blue" onClick={e => setCurrentTournament(e, _id)}>
					Manage
				</Button>
			</Card.Content>
		</Card>
	</Grid.Column>
)

export default TournamentCard
