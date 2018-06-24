import Team from '../models/Team'
import { NotFoundError } from '../errors'

export const index = (req, res, next) => {
	// TODO: error handle bad queries?
	const divisionQuery =
		req.query.division && req.query.division.match(/^(B|C)$/) ? req.query.division : /^(B|C)$/
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
			throw new NotFoundError('team')
		})
		.catch(err => next(err))
}

export const create = (req, res, next) => {
	Team.insertMany(req.body)
		.then(newTeams => res.status(201).json(newTeams))
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.catch(err => next(err))
		.then(team => {
			if (!team) throw new NotFoundError('team')
			team.set(req.body)
			return team.save()
		})
		.then(savedTeam => res.status(200).json(savedTeam.toObject()))
		.catch(err => next(err))
}

export const destroy = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.then(team => {
			if (!team) throw new NotFoundError('team')
			return team.remove()
		})
		.then(deletedTeam => res.json(deletedTeam.toObject()))
		.catch(err => next(err))
}
