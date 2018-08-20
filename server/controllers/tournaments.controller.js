import randomWords from 'random-words'
import Tournament from '../models/Tournament'
import { NotFoundError } from '../errors'

export const index = (req, res, next) => {
	let query
	if (req.user.group === 'admin') {
		query = Tournament.find()
	} else if (req.user) {
		query = Tournament.find({
			directors: req.user._id,
		})
	} else {
		return next(new NotFoundError('tournament'))
	}

	query
		.exec()
		.then(tournaments => res.json([...tournaments]))
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	let query
	if (req.user.group === 'admin') {
		query = Tournament.findById(req.params.tournamentId)
	} else if (req.user) {
		query = Tournament.findOne({
			_id: req.params.tournamentId,
			directors: req.user._id,
		})
	} else {
		return next(new NotFoundError('tournament'))
	}

	query
		.exec()
		.then(tournament => {
			if (!tournament) throw new NotFoundError('tournament')
			return res.json(tournament.toObject())
		})
		.catch(err => next(err))
}

export const create = (req, res, next) => {
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
		directors: [req.user._id],
	})

	tournament
		.save()
		.then(() => res.status(201).json(tournament.toObject()))
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) throw new NotFoundError('tournament')
			tournament.set(req.body)
			return tournament.save()
		})
		.then(updated => res.status(200).json(updated.toObject()))
		.catch(err => next(err))
}

export const destroy = (req, res, next) => {
	Tournament.findById(req.params.tournamentId)
		.exec()
		.then(tournament => {
			if (!tournament) throw new NotFoundError('tournament')
			return tournament.remove()
		})
		.then(deleted => res.status(200).json(deleted.toObject()))
		.catch(err => next(err))
}
