import Team from '../models/Team'
import { NotFoundError } from '../errors'

export const index = (req, res, next) => {
	// TODO: error handle bad queries?
	const divisionQuery = req.query.division.match(/^(B|C)$/) ? req.query.division : /^(B|C)$/
	Team.find({
		tournament: req.params.tournamentId,
		division: divisionQuery,
	})
		.exec()
		.then(teams => res.json(teams))
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.then(team => {
			if (team) return res.json(team.toObject())
			return res.status(404).json(new NotFoundError('team'))
		})
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.catch(err => next(err))
		.then(team => {
			if (!team) return res.status(404).json(new NotFoundError('team'))
			team.teamNumber = req.body.teamNumber
			team.school = req.body.school
			team.identifier = req.body.identifier
			team.division = req.body.division

			return team.save()
		})
		.then(savedTeam => res.status(200).json(savedTeam.toObject()))
		.catch(err => next(err))
}
