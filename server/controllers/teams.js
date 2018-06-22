const Team = require('../models/Team')
const errors = require('../config/errors')

export const index = (req, res) => {
	Team.find({ tournament: req.params.tournamentId })
		.exec()
		.then(teams => {
			if (teams) return res.json(teams)
			return res.status(404).json(errors.NO_TEAMS)
		})
		.catch(() => res.status(500).json(errors.UNKNOWN))
}
