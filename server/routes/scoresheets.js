const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')
const ScoresheetEntry = require('../models/ScoresheetEntry')
const helpers = require('./helpers')
const needsGroup = helpers.needsGroup
const getTeamsInTournamentByDivision = helpers.getTeamsInTournamentByDivision

router.get('/:tournamentId/scores/:division/:eventId', needsGroup('admin'), (req, res, next) => {
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
})

router.post('/:scoresheetId/updateEvent/:eventName', needsGroup('admin'), (req, res, next) => {
	ScoresheetEntry.findById(req.params.scoresheetId, (err, sse) => {
		console.log(sse)
		if (err) req.flash('error', 'An unknown error occurred: ' + err)
		Object.keys(req.body).forEach(id => {
			sse.scores.id(id).rawScore = req.body[id].rawScore || 0
			sse.scores.id(id).tier = req.body[id].tier || 1
			sse.scores.id(id).noShow = req.body[id].noShow || false
			sse.scores.id(id).participationOnly = req.body[id].participationOnly || false
			sse.scores.id(id).dq = req.body[id].dq || false
			sse.scores.id(id).notes = req.body[id].notes || ''
			sse.scores.id(id).tiebreaker = req.body[id].tiebreaker || 0
			sse.scores.id(id).dropped = req.body[id].dropped || false
		})

		sse.rank(err => {
			if (err) req.flash('error', err.message)
			else req.flash('success', 'Successfully updated scores for ' + req.params.eventName)
			res.json({
				message: req.flash()
			})
		})
	})
})

router.get('/:scoresheetId/rank', needsGroup('admin'), (req, res, next) => {
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
