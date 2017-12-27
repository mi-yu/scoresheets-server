const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const randomWords = require('random-words')
const needsGroup = require('./helpers').needsGroup
const getEventsList = require('./helpers').getEventsList

/* GET users listing. */
router.post('/new', needsGroup('admin'), (req, res, next) => {
	let date = new Date(req.body.date)
	date = new Date(date.getTime() + date.getTimezoneOffset()*60*1000)

	Event.find({
		'name': {
			$in: req.body.events
		}
	}, '_id', (err, results) => {
		if (err)
			req.flash('error', 'Could not get events.')

		let events = []
		results.forEach((e) => {
			events.push({
				'event': e._id
			})
		})

		const tournament = new Tournament({
			name: req.body.name,
			date: date,
			state: req.body.state,
			city: req.body.city,
			numTeams: req.body.numTeams,
			joinCode: randomWords({exactly: 5, join: '-'}),
			events: events
		})

		tournament.save((err) => {
			if (err && err.code === 11000)
				req.flash('error', 'A tournament named "' + tournament.name + '" already exists.')
			else if (err)
				req.flash('error', 'An unknown error occurred: ' + err)
			else
				req.flash('success', 'Successfully created tournament "' + tournament.name + '"')
			res.redirect('/admin/dashboard')
		})
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

router.get('/manage/:id', needsGroup('admin'), getEventsList, (req, res, next) => {
	Tournament.findById(req.params.id)
		.populate('events.event events.proctors')
		.exec((err, result) => {
			if (err)
				req.flash('error', 'The requested tournament could not be found.')
			res.render('tournaments/manage', {
				tournament: result,
				action: '/tournaments/edit/' + result._id
			})
		})
})

module.exports = router
