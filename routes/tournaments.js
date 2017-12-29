const router = require('express').Router()
const User = require('../models/User')
const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')
const randomWords = require('random-words')
const helpers = require('./helpers')
const needsGroup = helpers.needsGroup
const getEventsList = helpers.getEventsList
const getSchoolsList = helpers.getSchoolsList
const getTeamsInTournament = helpers.getTeamsInTournament

/* GET users listing. */
router.post('/new', needsGroup('admin'), (req, res, next) => {
	let date = new Date(req.body.date)
	date = new Date(date.getTime() + date.getTimezoneOffset()*60*1000)

	const tournament = new Tournament({
		name: req.body.name,
		date: date,
		state: req.body.state,
		city: req.body.city,
		numTeams: req.body.numTeams,
		joinCode: randomWords({exactly: 5, join: '-'}),
		events: req.body.events
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

router.get('/manage/:id', 
	needsGroup('admin'),
	getEventsList,
	getSchoolsList,
	getTeamsInTournament,
	(req, res, next) => {
	Tournament.findById(req.params.id)
		.populate('events scoresheet')
		.exec((err, result) => {
			console.log(err)
			console.log(result)
			if (err) {
				req.flash('error', 'The requested tournament could not be found.')
				next()
			}
			else
				res.render('tournaments/manage', {
					tournament: result,
					action: '/tournaments/edit/' + result._id
				})
		})
})

router.post('/edit/:id', needsGroup('admin'), (req, res, next) => {
	Event.find({
		'name': {
			$in: req.body.events
		}
	}, '_id', (err, results) => {
		let events = []
		results.forEach((e) => {
			events.push({
				'event': e._id
			})
		})
		Tournament.update({_id: req.params.id}, {
			$set: {
				name: req.body.name,
				date: req.body.date,
				state: req.body.state,
				city: req.body.city,
				numTeams: req.body.numTeams,
				events: events
			}
		}, (err) => {
			if (err)
				req.flash('error', 'There was an error updating the tournament details: ' + err)
			res.redirect('/tournaments/manage/' + req.params.id)
		})		
	})
})

router.post('/edit/:id/addTeam', needsGroup('admin'), (req, res, next) => {
	const team = new Team({
		tournament: req.params.id,
		school: req.body.school,
		teamNumber: req.body.teamNumber
	})

	team.save((err) => {
		if (err)
			req.flash('error', 'An unknown error occurred: ' + err)
		else
			req.flash('success', 'Successfully created team ' + team.teamNumber + ' (' + team.school + ').')
		res.redirect('/tournaments/manage/' + req.params.id)
	})
})

module.exports = router
