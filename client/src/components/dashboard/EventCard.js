import React from 'react'
import Auth from '../../modules/Auth'
import { Card, Label, Button, Grid } from 'semantic-ui-react'

const EventCard = ({ _id, name, category, stateEvent, impound, division }) => (
	<Grid.Column width={4}>
		<Card>
			<Card.Content>
				<Card.Header>{name}</Card.Header>
				<Card.Description>
					<Label size='tiny'>{category}</Label>
					<Label size='tiny'>{division}</Label>
				</Card.Description>
			</Card.Content>
			<Card.Content>
				<Button fluid color='blue'>Edit</Button>
			</Card.Content>
		</Card>
	</Grid.Column>
)

export default EventCard