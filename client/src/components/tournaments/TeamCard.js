import React from 'react'
import { Card, Label, Button, Grid, Dropdown, Icon } from 'semantic-ui-react'

const TeamCard = ({ team }) => (
	<Grid.Column width={4}>
    <Card>
  <Card.Content>
        <Card.Header>{team.division + team.teamNumber}</Card.Header>
				<Card.Description>
					{`${team.school} ${team.identifier || ''}`}
    </Card.Description>
      </Card.Content>
			<Card.Content>
				<Button.Group basic>
					<Button icon>
						<Icon name="trophy" />
							Scores
  </Button>
					<Button icon>
    <Icon name="edit" />
							Edit
  </Button>
					<Button icon>
						<Icon name="delete" />
							Delete
  </Button>
  </Button.Group>
      </Card.Content>
		</Card>
  </Grid.Column>
)

export default TeamCard
