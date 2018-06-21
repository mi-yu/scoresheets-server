const randomWords = require('random-words')
const Tournament = require('../models/Tournament')
const errors = require('../config/errors')

exports.index = (req, res) => {
	Tournament.find()
		.exec()
		.then(tournaments => {
			if (!tournaments) return res.status(404).json(errors.NO_TOURNAMENTS)
			return res.json([...tournaments])
		})
		.catch(() => res.status(500).json(errors.INTERNAL_SERVER_ERROR))
}

exports.show = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(errors.notFound('tournament'))
			return res.json({ ...tournament.toObject() })
		})
		.catch(err => {
			console.log(err)
			return res.status(500).json(errors.INTERNAL_SERVER_ERROR)
		})
}

exports.create = (req, res) => {
	// TODO: fix dates
	const date = new Date(req.body.date)

	const tournament = new Tournament({
		name: req.body.name,
		state: req.body.state,
		city: req.body.city,
		joinCode: randomWords({ exactly: 5, join: '-' }),
		events: req.body.events,
		date,
	})

	tournament
		.save()
		.then(() => res.status(201).json({ ...tournament.toObject() }))
		.catch(err => {
			if (err.code === 11000) {
				return res.status(400).json(errors.duplicateError('name', 'tournaments'))
			}
			return res.status(500).json({
				...errors.UNKNOWN,
				message: 'There was an unknown error creating the tournament.',
			})
		})
}

exports.update = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(errors.notFound('tournament'))
			tournament.name = req.body.name
			tournament.date = req.body.date
			tournament.state = req.body.state
			tournament.city = req.body.city
			tournament.events = req.body.events
			return tournament.save()
		})
		.then(updated => res.status(200).json({ ...updated.toObject() }))
		.catch(err =>
			res.status(500).json({
				...errors.UNKNOWN,
				message: 'There was an unknown error updating the tournament.',
			}),
		)
}

exports.destroy = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(errors.notFound('tournament'))
			return tournament.remove()
		})
		.then(deleted => res.status(200).json({ ...deleted.toObject() }))
		.catch(err =>
			res.status(500).json({
				...errors.UNKNOWN,
				message: 'There was an unknown error deleting the tournament.',
			}),
		)
}

exports.catchAll = (req, res) => {
	return res.status(400).json(errors.UNSUPPORTED_ACTION)
}
