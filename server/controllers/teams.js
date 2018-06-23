import { NO_TEAMS, UNKNOWN, notFoundError } from '../config/errors'
import Team from '../models/Team'

export const index = (req, res, next) => {
	// TODO: error handle bad queries?
	const divisionQuery = req.query.division.match(/^(B|C)$/) ? req.query.division : /^(B|C)$/
	Team.find({
		tournament: req.params.tournamentId,
		division: divisionQuery,
	})
		.exec()
		.then(teams => {
			if (teams) return res.json(teams)
			return res.status(404).json(NO_TEAMS)
		})
		.catch(() => res.status(500).json(UNKNOWN))
}

export const show = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.then(team => {
			if (team) return res.json(team.toObject())
			return res.status(404).json(notFoundError('team'))
		})
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.catch(err => res.status(500).json(UNKNOWN))
		.then(team => {
			if (!team) return res.status(404).json(notFoundError('team'))
			team.teamNumber = req.body.teamNumber
			team.school = req.body.school
			team.identifier = req.body.identifier
			team.division = req.body.division

			return team.save()
		})
		.then(savedTeam => res.status(200).json(savedTeam.toObject()))
		.catch(err => {
			return next(err)
		})
}
