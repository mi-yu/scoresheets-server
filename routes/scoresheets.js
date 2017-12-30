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
		res.render('tournaments/event-detail', {
			scoresheetEntry: result
		})
	})
})

module.exports = router