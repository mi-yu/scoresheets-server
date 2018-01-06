const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')
const ScoresheetEntry = require('../models/ScoresheetEntry')
const helpers = require('./helpers')
const needsGroup = helpers.needsGroup
const getTeamsInTournament = helpers.getTeamsInTournament

router.get('/:tournamentId/scores/:eventId',
	needsGroup('admin'),
	getTeamsInTournament,
	(req, res, next) => {
	ScoresheetEntry.findOne({
		tournament: req.params.tournamentId,
		event: req.params.eventId
	})
	.populate('tournament event scores.team')
	.exec((err, result) => {
		if (err)
			req.flash('error', 'An unknown error occurred: ' + err)
		else {
			// Sort scores by team number
			result.scores.sort((s1, s2) => {
				console.log(s1, s2)
				let t1 = s1.team.teamNumber
				let t2 = s2.team.teamNumber
				console.log(t1, t2)
				if (t1 > t2)
					return 1
				if (t1 === t2)
					return 0
				if (t1 < t2)
					return -1
			})
			console.log(result.scores)
		}
		res.render('tournaments/event-detail', {
			scoresheetEntry: result
		})
	})
})

router.post('/:scoresheetId/updateEvent/:eventName', needsGroup('admin'), (req, res, next) => {
	ScoresheetEntry.findById(req.params.scoresheetId, (err, sse) => {
		if (err)
			req.flash('error', 'An unknown error occurred: ' + err)
		Object.keys(req.body).forEach((id) => {
			sse.scores.id(id).rawScore = req.body[id].rawScore || 0
			sse.scores.id(id).tier = req.body[id].tier || 1
			sse.scores.id(id).noShow = req.body[id].noShow || false
			sse.scores.id(id).participationOnly = req.body[id].participationOnly || false
			sse.scores.id(id).notes = req.body[id].notes || ''
			sse.scores.id(id).tiebreaker = req.body[id].tiebreaker || 0
		})
		sse.save((err) => {
			if (err)
				req.flash('error', 'There was an error saving scoresheet data.')
			else
				req.flash('success', 'Successfully updated scores for ' + req.params.eventName)
			res.redirect('/scoresheets/' + sse.tournament + '/scores/' + sse.event)
		})
	})
})

module.exports = router