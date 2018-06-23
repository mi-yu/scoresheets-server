import { Router } from 'express'
import { index, show, create, update, destroy } from '../controllers/tournaments.controller'
import { ensureAuthenticated, needsGroup } from '../passport/auth'

const router = new Router()

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.post('/', create)

router.get('/:tournamentId', show)

router.patch('/:tournamentId', update)

router.delete('/:tournamentId', destroy)

export default router

// router.post('/:id/edit/addTeam', ensureAuthenticated, needsGroup('admin'), (req, res) => {
// 	const team = new Team({
// 		tournament: req.params.id,
// 		school: req.body.school,
// 		teamNumber: req.body.teamNumber,
// 		division: req.body.division,
// 		identifier: req.body.identifier,
// 	})

// 	team.save(err => {
// 		if (err) {
// 			if (err.code === 11000) {
// 				req.flash(
// 					'error',
// 					`A team with team number ${req.body.teamNumber} already exists for division ${
// 						req.body.division
// 					}.`,
// 				)
// 			} else req.flash('error', `An unknown error occurred: ${err.errmsg}`)
// 			res.json({
// 				message: req.flash(),
// 				invalidTeam: err.getOperation(),
// 			})
// 		} else {
// 			req.flash(
// 				'success',
// 				`Successfully created team ${team.school} ${team.identifier ||
// 					''} (${team.division + team.teamNumber})`,
// 			)
// 			res.json({
// 				message: req.flash(),
// 				newTeam: team,
// 			})
// 		}
// 	})
// })

// router.post('/:id/edit/bulkAddTeams', ensureAuthenticated, needsGroup('admin'), (req, res) => {
// 	// console.log('flksjdfl')
// 	console.log(req.body)
// 	Team.insertMany(req.body, (err, docs) => {
// 		if (err) {
// 			if (err.code === 11000) {
// 				req.flash(
// 					'error',
// 					`A team with team number ${
// 						err.getOperation().teamNumber
// 					} already exists for division ${err.getOperation().division}.`,
// 				)
// 			} else req.flash('error', `An unknown error occurred: ${err.message}`)
// 			return res.json({
// 				message: req.flash(),
// 				invalidTeam: err.code === 11000 ? err.getOperation() : null,
// 				redirect: false,
// 			})
// 		}
// 		req.flash('success', `Successfully created ${docs.length} team(s).`)

// 		res.json({
// 			message: req.flash(),
// 			newTeams: docs,
// 			redirect: true,
// 		})
// 	})
// })

// router.get('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
// 	Team.findOne({
// 		tournament: req.params.tournamentId,
// 		teamNumber: req.params.teamNumber,
// 		division: req.params.division,
// 	})
// 		.populate('tournament')
// 		.exec((err, result) => {
// 			if (err) req.flash('error', `An unknown error occurred: ${err}`)
// 			res.locals.team = result
// 			res.render('teams/delete')
// 		})
// })

// router.post('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
// 	Team.findOne(
// 		{
// 			tournament: req.params.tournamentId,
// 			teamNumber: req.params.teamNumber,
// 			division: req.params.division,
// 		},
// 		(err, result) => {
// 			result.remove()
// 			if (err) req.flash('error', `Unable to find team ${req.params.teamNumber}: ${err}`)
// 			else {
// 				req.flash(
// 					'success',
// 					`Successfully deleted team ${req.params.division}${req.params.teamNumber}`,
// 				)
// 			}
// 			res.redirect(`/tournaments/${req.params.tournamentId}/manage`)
// 		},
// 	)
// })

// router.post('/:tournamentId/edit/:division/editTeam/:teamNumber', (req, res, next) => {
// 	Team.findOne(
// 		{
// 			tournament: req.params.tournamentId,
// 			teamNumber: req.params.teamNumber,
// 			division: req.params.division,
// 		},
// 		(err, result) => {
// 			if (err) {
// 				req.flash('error', `Unable to find team ${req.params.teamNumber}: ${err}`)
// 				next()
// 			}
// 			result.teamNumber = req.body.teamNumber
// 			result.school = req.body.school
// 			result.save(error => {
// 				if (error) {
// 					req.flash(
// 						'error',
// 						`There was an error saving team ${result.teamNumber}: ${error}`,
// 					)
// 				} else req.flash('success', `Successfully updated team ${result.teamNumber}`)
// 				res.redirect(`/tournaments/${req.params.tournamentId}/manage`)
// 			})
// 		},
// 	)
// })

// router.get(
// 	'/:tournamentId/:division/results',
// 	getTeamsInTournamentByDivision,
// 	mw.getScoresheetsInTournament,
// 	mw.populateTotalsAndRankTeams,
// 	(req, res) => {
// 		res.json({
// 			entries: res.locals.entries,
// 			teams: res.locals.teams,
// 		})
// 	},
// )

// // TODO: variable top ranks
// router.get(
// 	'/:tournamentId/slideshow',
// 	mw.getTopTeamsPerEvent,
// 	mw.getTopBTeams,
// 	mw.getTopCTeams,
// 	(req, res) => {
// 		Tournament.findById(req.params.tournamentId, (err, tournament) => {
// 			if (err) req.flash('error', err.message)
// 			res.json({
// 				message: req.flash(),
// 				tournament,
// 				topTeamsPerEvent: res.locals.topTeamsPerEvent,
// 				topBTeams: res.locals.topBTeams,
// 				topCTeams: res.locals.topCTeams,
// 			})
// 		})
// 	},
// )
