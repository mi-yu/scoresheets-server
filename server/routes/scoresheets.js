const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')
const ScoresheetEntry = require('../models/ScoresheetEntry')
const auth = require('./middleware/auth')
const ensureAuthenticated = auth.ensureAuthenticated
const needsGroup = auth.needsGroup
const getTeamsInTournamentByDivision = require('./helpers').getTeamsInTournamentByDivision

router.get(
	'/:tournamentId/scores/:division/:eventId',
	ensureAuthenticated,
	needsGroup('admin'),
	(req, res, next) => {
		ScoresheetEntry.findOne({
			tournament: req.params.tournamentId,
			event: req.params.eventId,
			division: req.params.division
		})
			.populate('tournament event scores.team')
			.exec((err, result) => {
				if (err) req.flash('error', 'An unknown error occurred: ' + err.message)
				else if (!result) req.flash('error', 'Could not get scoresheet entry')
				else {
					// Sort scores by team number
					result.scores.sort((s1, s2) => {
						let t1 = s1.team.teamNumber
						let t2 = s2.team.teamNumber
						if (t1 > t2) return 1
						if (t1 === t2) return 0
						if (t1 < t2) return -1
					})
				}
				res.json({
					scoresheetEntry: result,
					message: req.flash()
				})
			})
	}
)

router.post('/:scoresheetId/update', ensureAuthenticated, needsGroup('admin'), (req, res, next) => {
	console.log(req.body)
	ScoresheetEntry.findById(req.params.scoresheetId, (err, sse) => {
		if (err) req.flash('error', 'An unknown error occurred: ' + err)
		req.body.scores.forEach(score => {
			sse.scores.id(score._id).rawScore = score.rawScore || 0
			sse.scores.id(score._id).tier = score.tier || 1
			sse.scores.id(score._id).noShow = score.noShow || false
			sse.scores.id(score._id).participationOnly = score.participationOnly || false
			sse.scores.id(score._id).dq = score.dq || false
			sse.scores.id(score._id).notes = score.notes || ''
			sse.scores.id(score._id).tiebreaker = score.tiebreaker || 0
			sse.scores.id(score._id).dropped = score.dropped || false
		})

		sse.rank(err => {
			if (err) req.flash('error', err.message)
			else req.flash('success', 'Successfully updated scores for ' + req.body.eventName)
			res.json({
				message: req.flash()
			})
		})
	})
})

router.get('/:scoresheetId/rank', ensureAuthenticated, needsGroup('admin'), (req, res, next) => {
	ScoresheetEntry.findById(req.params.scoresheetId).exec((err, sse) => {
		if (err) {
			req.flash('error', err)
			res.redirect('/scoresheets/' + sse.tournament + '/scores/' + sse.event.name)
		} else {
			sse.rank(err => {
				if (err)
					req.flash(
						'error',
						'There was an error ranking teams for ' + sse.event.name + ': ' + err
					)
				else req.flash('success', 'Generated ranks.')
				res.redirect('/scoresheets/' + sse.tournament + '/scores/' + sse.event)
			})
		}
	})
})

module.exports = router
