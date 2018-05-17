import React from 'react'
import Auth from '../../modules/Auth'
import { Card, Label, Button, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

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
				<div className="ui two buttons">
					<Button
						as={Link}
						color="blue"
						to={{
							pathname: `/tournaments/${_id}/manage`,
							state: {
								tournament: {
									_id,
									name,
									city,
									state,
									date
								}
							}
						}}
					>
						Manage
					</Button>
					<Button color="grey" onClick={e => setCurrentTournament(e, _id)}>
						Edit Details
					</Button>
				</div>
			</Card.Content>
		</Card>
	</Grid.Column>
)

export default TournamentCard
