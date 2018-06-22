import {
	NO_TEAMS,
	UNKNOWN,
} from '../config/errors'
import Team from '../models/Team'

export const index = (req, res) => {
	Team.find({
		tournament: req.params.tournamentId,
	})
		.exec()
		.then(teams => {
			if (teams) return res.json(teams)
			return res.status(404).json(NO_TEAMS)
		})
		.catch(() => res.status(500).json(UNKNOWN))
}

export default {}
