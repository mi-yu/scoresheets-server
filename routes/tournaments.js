const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const randomWords = require('random-words')
const needsGroup = require('./helpers').needsGroup

/* GET users listing. */
router.post('/new', needsGroup('admin'), (req, res, next) => {
	const tournament = new Tournament({
		name: req.body.name,
		date: req.body.date,
		state: req.body.state,
		city: req.body.city,
		numTeams: req.body.numTeams,
		joinCode: randomWords({exactly: 5, join: '-'})
	})

	tournament.save((err) => {
		if (err && err.code === 11000)
			req.flash('error', 'A tournament named "' + tournament.name + '" already exists.')
		else
			req.flash('success', 'Successfully created tournament "' + tournament.name + '"')
		res.redirect('/admin/dashboard')
	})
})

router.get('/delete/:id', needsGroup('admin'), (req, res, next) => {
	Tournament.findById(req.params.id, (err, result) => {
		if (err)
			req.flash('error', 'The requested tournament could not be found.')
		res.render('tournaments/delete', {
			'tournament': result
		})
	})
})

router.post('/delete/:id', needsGroup('admin'), (req, res, next) => {
	Tournament.findByIdAndRemove(req.params.id, (err, deleted) => {
		if (err)
			req.flash('error', 'The requested tournament could not be deleted.')
		else if (deleted)
			req.flash('success', 'Successfully deleted tournament ' + deleted.name)

		res.redirect('/admin/dashboard')
	})
})

module.exports = router
