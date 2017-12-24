const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const randomWords = require('random-words')
const needsGroup = require('./helpers').needsGroup

/* GET users listing. */
router.post('/new', needsGroup('admin'), function(req, res, next) {
	const tournament = new Tournament({
		name: req.body.name,
		date: req.body.date,
		joinCode: randomWords({exactly: 5, join: '-'})
	})

	tournament.save((err) => {
		if (err)
			req.flash('error', 'There was an error creating the tournament: ' + err)
	})

	req.flash('success', 'Successfully created tournament ' + tournament.name)
	res.redirect('/admin/dashboard')
})

module.exports = router
