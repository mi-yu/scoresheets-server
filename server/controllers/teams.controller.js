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
		.then(teams => {
			const teamsToObject = teams.map(team => team.toObject({ virtuals: true }))
			res.json(teamsToObject)
		})

		.catch(err => next(err))
}

export const show = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.then(team => {
			if (team) return res.json(team.toObject({ virtuals: true }))
			throw new NotFoundError('team')
		})
		.catch(err => next(err))
}

export const create = (req, res, next) => {
	Team.insertMany(req.body)
		.then(newTeams => {
			const teamsToObject = newTeams.map(team => team.toObject({ virtuals: true }))
			res.status(201).json(teamsToObject)
		})
		.catch(err => {
			if (err.result.hasWriteErrors()) {
				const errs = err.result.getWriteErrors()
				return res.status(400).json({
					errors: errs,
					name: 'BulkWriteError',
				})
			}
			return next(err)
		})
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
		.then(savedTeam => res.status(200).json(savedTeam.toObject({ virtuals: true })))
		.catch(err => next(err))
}

export const destroy = (req, res, next) => {
	Team.findById(req.params.teamId)
		.exec()
		.then(team => {
			if (!team) throw new NotFoundError('team')
			return team.remove()
		})
		.then(deletedTeam => res.json(deletedTeam.toObject({ virtuals: true })))
		.catch(err => next(err))
}
