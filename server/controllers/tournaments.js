import randomWords from 'random-words'
import {
	NO_TOURNAMENTS,
	UNKNOWN,
	UNSUPPORTED_ACTION,
	duplicateError,
	notFoundError,
} from '../config/errors'
import Tournament from '../models/Tournament'

export const index = (req, res) => {
	Tournament.find()
		.exec()
		.then(tournaments => {
			if (!tournaments) return res.status(404).json(NO_TOURNAMENTS)
			return res.json([...tournaments])
		})
		.catch(() => res.status(500).json(UNKNOWN))
}

export const show = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(notFoundError('tournament'))
			return res.json({ ...tournament.toObject(),
			})
		})
		.catch(err => res.status(500).json(UNKNOWN))
}

export const create = (req, res) => {
	// TODO: fix dates
	const date = new Date(req.body.date)

	const tournament = new Tournament({
		name: req.body.name,
		state: req.body.state,
		city: req.body.city,
		joinCode: randomWords({
			exactly: 5,
			join: '-',
		}),
		events: req.body.events,
		date,
	})

	tournament
		.save()
		.then(() => res.status(201).json({ ...tournament.toObject(),
		}))
		.catch(err => {
			if (err.code === 11000) {
				return res.status(400).json(duplicateError('name', 'tournaments'))
			}
			return res.status(500).json({
				...UNKNOWN,
				message: 'There was an unknown error creating the tournament.',
			})
		})
}

export const update = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(notFoundError('tournament'))
			tournament.name = req.body.name
			tournament.date = req.body.date
			tournament.state = req.body.state
			tournament.city = req.body.city
			tournament.events = req.body.events
			return tournament.save()
		})
		.then(updated => res.status(200).json({ ...updated.toObject(),
		}))
		.catch(err =>
			res.status(500).json({
				...UNKNOWN,
				message: 'There was an unknown error updating the tournament.',
			}),
		)
}

export const destroy = (req, res) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) return res.status(404).json(notFoundError('tournament'))
			return tournament.remove()
		})
		.then(deleted => res.status(200).json({ ...deleted.toObject(),
		}))
		.catch(err =>
			res.status(500).json({
				...UNKNOWN,
				message: 'There was an unknown error deleting the tournament.',
			}),
		)
}

export const catchAll = (req, res) => res.status(400).json(UNSUPPORTED_ACTION)
