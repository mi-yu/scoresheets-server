const router = require('express').Router()
const Event = require('../models/Event')
const { ensureAuthenticated, needsGroup } = require('../passport/auth')

router.post('/new', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	const event = new Event({
		name: req.body.name,
		division: req.body.division,
		category: req.body.category,
		resources: req.body.resources,
		inRotation: req.body.inRotation,
		impound: req.body.impound,
		stateEvent: req.body.stateEvent,
		highScoreWins: req.body.highScoreWins,
		topic: req.body.currentTopic,
	})

	event.save((err, doc) => {
		if (err) req.flash('error', err.message)
		else req.flash('success', `Successfully created new event: ${event.name}`)
		res.json({
			message: req.flash(),
			newEvent: event,
		})
	})
})

router.post('/:eventId/edit', ensureAuthenticated, needsGroup('admin'), (req, res) => {
	console.log(req.body.category)
	Event.findByIdAndUpdate(
		req.params.eventId,
		{
			$set: {
				name: req.body.name,
				division: req.body.division,
				category: req.body.category,
				resources: req.body.resources,
				inRotation: req.body.inRotation,
				impound: req.body.impound,
				stateEvent: req.body.stateEvent,
				highScoreWins: req.body.highScoreWins,
				currentTopic: req.body.currentTopic,
			},
		},
		{
			new: true,
		},
		(err, updated) => {
			if (err) req.flash('error', err.message)
			else req.flash('success', `Successfully updated ${updated.name}`)
			res.json({
				message: req.flash(),
				updatedEvent: updated,
			})
		},
	)
})

module.exports = router
