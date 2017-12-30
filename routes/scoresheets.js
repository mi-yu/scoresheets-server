const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')
const Scoresheet = require('../models/Scoresheet')
const helpers = require('./helpers')
const needsGroup = helpers.needsGroup
const getTeamsInTournament = helpers.getTeamsInTournament

router.get('/:tournamentId/scores/:eventName',
	needsGroup('admin'),
	getTeamsInTournament,
	(req, res, next) => {
	Scoresheet.findOne({tournament: req.params.tournamentId})
		.populate('tournament')
		.populate({
			path: 'entries.event',
			populate: {
				path: 'entries.event',
				model: 'Event'
			}
		})
		.exec((err, result) => {
			if (err)
				req.flash('error', 'An unknown error occurred: ' + err)
			res.render('tournaments/event-detail', {
				scoresheet: result,
				eventName: req.params.eventName
			})
		})
})

module.exports = router