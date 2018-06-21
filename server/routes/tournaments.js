const router = require('express').Router()
const Team = require('../models/Team')
const {
	getCurrentEventsList,
	getSchoolsList,
	getAllTeamsInTournament,
	getTeamsInTournamentByDivision,
} = require('./helpers')
const mw = require('./middleware/tournaments.mw.js')
const { ensureAuthenticated, needsGroup } = require('../passport/auth')
const { index, show, create, update, destroy, catchAll } = require('../controllers/tournaments')

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.post('/', create)

router.get('/:tournamentId', show)

router.patch('/:tournamentId', update)

router.delete('/:tournamentId', destroy)

router.all('*', catchAll)

router.get('/:id/delete', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	Tournament.findById(req.params.id, (err, result) => {
		if (err) req.flash('error', 'The requested tournament could not be found.')
		res.json({
			message: req.flash(),
			tournament: result,
		})
	})
})

router.post('/:id/delete', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	Tournament.findByIdAndRemove(req.params.id, (err, deleted) => {
		deleted.remove()
		if (err) req.flash('error', 'The requested tournament could not be deleted.')
		else if (deleted) req.flash('success', `Successfully deleted tournament ${deleted.name}`)

		res.json({
			message: req.flash(),
		})
	})
})

router.get(
	'/:tournamentId/allData',
	ensureAuthenticated,
	needsGroup('admin'),
	getCurrentEventsList,
	getSchoolsList,
	getAllTeamsInTournament,
	(req, res, next) => {
		Tournament.findById(req.params.tournamentId)
			.populate('events')
			.exec((err, result) => {
				if (err) {
					req.flash('error', 'The requested tournament could not be found.')
					next()
				} else {
					result.events.sort((a, b) => {
						if (a.name < b.name) return -1
						if (a.name > b.name) return 1
						return 0
					})
					res.json({
						tournament: result,
						events: res.locals.events,
						schools: res.locals.schools,
						teams: res.locals.teams,
					})
				}
			})
	},
)

router.post('/:id/edit', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	Tournament.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name: req.body.name,
				date: req.body.date,
				state: req.body.state,
				city: req.body.city,
				events: req.body.events,
			},
		},
		(err, updated) => {
			if (err) {
				req.flash('error', `There was an error updating the tournament details: ${err}`)
			} else req.flash('success', `Successfully updated tournament ${updated.name}`)
			res.json({
				message: req.flash(),
				updatedTournament: updated,
			})
		},
	)
})

router.post('/:id/edit/addTeam', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	const team = new Team({
		tournament: req.params.id,
		school: req.body.school,
		teamNumber: req.body.teamNumber,
		division: req.body.division,
		identifier: req.body.identifier,
	})

	team.save(err => {
		if (err) {
			if (err.code === 11000) {
				req.flash(
					'error',
					`A team with team number ${req.body.teamNumber} already exists for division ${
						req.body.division
					}.`,
				)
			} else req.flash('error', `An unknown error occurred: ${err.errmsg}`)
			res.json({
				message: req.flash(),
				invalidTeam: err.getOperation(),
			})
		} else {
			req.flash(
				'success',
				`Successfully created team ${team.school} ${team.identifier ||
					''} (${team.division + team.teamNumber})`,
			)
			res.json({
				message: req.flash(),
				newTeam: team,
			})
		}
	})
})

router.post('/:id/edit/bulkAddTeams', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	// console.log('flksjdfl')
	console.log(req.body)
	Team.insertMany(req.body, (err, docs) => {
		if (err) {
			if (err.code === 11000) {
				req.flash(
					'error',
					`A team with team number ${
						err.getOperation().teamNumber
					} already exists for division ${err.getOperation().division}.`,
				)
			} else req.flash('error', `An unknown error occurred: ${err.message}`)
			return res.json({
				message: req.flash(),
				invalidTeam: err.code === 11000 ? err.getOperation() : null,
				redirect: false,
			})
		}
		req.flash('success', `Successfully created ${docs.length} team(s).`)

		res.json({
			message: req.flash(),
			newTeams: docs,
			redirect: true,
		})
	})
})

router.get('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
	Team.findOne({
		tournament: req.params.tournamentId,
		teamNumber: req.params.teamNumber,
		division: req.params.division,
	})
		.populate('tournament')
		.exec((err, result) => {
			if (err) req.flash('error', `An unknown error occurred: ${err}`)
			res.locals.team = result
			res.render('teams/delete')
		})
})

router.post('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
	Team.findOne(
		{
			tournament: req.params.tournamentId,
			teamNumber: req.params.teamNumber,
			division: req.params.division,
		},
		(err, result) => {
			result.remove()
			if (err) req.flash('error', `Unable to find team ${req.params.teamNumber}: ${err}`)
			else {
				req.flash(
					'success',
					`Successfully deleted team ${req.params.division}${req.params.teamNumber}`,
				)
			}
			res.redirect(`/tournaments/${req.params.tournamentId}/manage`)
		},
	)
})

router.post('/:tournamentId/edit/:division/editTeam/:teamNumber', (req, res, next) => {
	Team.findOne(
		{
			tournament: req.params.tournamentId,
			teamNumber: req.params.teamNumber,
			division: req.params.division,
		},
		(err, result) => {
			if (err) {
				req.flash('error', `Unable to find team ${req.params.teamNumber}: ${err}`)
				next()
			}
			result.teamNumber = req.body.teamNumber
			result.school = req.body.school
			result.save(error => {
				if (error) {
					req.flash(
						'error',
						`There was an error saving team ${result.teamNumber}: ${error}`,
					)
				} else req.flash('success', `Successfully updated team ${result.teamNumber}`)
				res.redirect(`/tournaments/${req.params.tournamentId}/manage`)
			})
		},
	)
})

router.get(
	'/:tournamentId/:division/results',
	getTeamsInTournamentByDivision,
	mw.getScoresheetsInTournament,
	mw.populateTotalsAndRankTeams,
	(req, res) => {
		res.json({
			entries: res.locals.entries,
			teams: res.locals.teams,
		})
	},
)

// TODO: variable top ranks
router.get(
	'/:tournamentId/slideshow',
	mw.getTopTeamsPerEvent,
	mw.getTopBTeams,
	mw.getTopCTeams,
	(req, res) => {
		Tournament.findById(req.params.tournamentId, (err, tournament) => {
			if (err) req.flash('error', err.message)
			res.json({
				message: req.flash(),
				tournament,
				topTeamsPerEvent: res.locals.topTeamsPerEvent,
				topBTeams: res.locals.topBTeams,
				topCTeams: res.locals.topCTeams,
			})
		})
	},
)

module.exports = router
