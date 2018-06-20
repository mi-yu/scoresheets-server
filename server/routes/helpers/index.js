const Tournament = require('../../models/Tournament')
const Event = require('../../models/Event')
const Team = require('../../models/Team')
const errors = require('../../config/errors')

module.exports = {
	getTournamentList: (req, res, next) => {
		Tournament.find((err, results) => {
			if (err) res.status(500).json(errors.UNKNOWN)
			res.locals.tournaments = results
			return next()
		})
	},
	getCurrentEventsList: (req, res, next) => {
		Event.find({ inRotation: true })
			.sort('name')
			.exec((err, results) => {
				if (err) req.flash('error', `Could not load events: ${err}`)
				res.locals.events = results
				return next()
			})
	},
	getSchoolsList: (req, res, next) => {
		Team.find({}, '-_id school', (err, results) => {
			if (err) req.flash('error', `Could not load schools: ${err}`)
			const schools = []
			results.forEach(el => {
				schools.push(el.school)
			})
			res.locals.schools = Array.from(new Set(schools))
			return next()
		})
	},
	getTeamsInTournamentByDivision: (req, res, next) => {
		Team.find({ tournament: req.params.tournamentId, division: req.params.division })
			.lean()
			.sort('teamNumber')
			.exec((err, results) => {
				if (err) req.flash('error', `Could not load teams: ${err}`)
				res.locals.teams = results
				return next()
			})
	},
	getAllTeamsInTournament: (req, res, next) => {
		Team.find({ tournament: req.params.tournamentId })
			.lean()
			.sort('teamNumber')
			.exec((err, results) => {
				if (err) req.flash('error', err.message)
				res.locals.teams = results
				return next()
			})
	},
}
