import React from 'react'
import Auth from '../../modules/Auth'
import { Card, Label, Button, Grid } from 'semantic-ui-react'

const EventCard = ({ _id, name, category, stateEvent, impound, division, setCurrentEvent }) => {
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
					</Card.Description>
				</Card.Content>
				<Card.Content>
					<Button fluid color="blue" onClick={e => setCurrentEvent(e, _id)}>
						Edit
					</Button>
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

export default EventCard
