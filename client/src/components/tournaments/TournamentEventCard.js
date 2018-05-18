import React from 'react'
import { Card, Label, Button, Grid, Dropdown, Menu } from 'semantic-ui-react'

const EventCard = ({
	_id,
	name,
	category,
	stateEvent,
	impound,
	division,
	finished,
	setCurrentEvent
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
					{division.length === 1 ? (
						<Button fluid color="blue">
							Manage Scores
						</Button>
					) : (
						<Menu color="blue" inverted>
							<Dropdown item fluid text="Choose a division">
								<Dropdown.Menu>
									<Dropdown.Item>Manage B Scores</Dropdown.Item>
									<Dropdown.Item>Manage C Scores</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Menu>
					)}
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

export default EventCard
