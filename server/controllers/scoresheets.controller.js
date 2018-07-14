import ScoresheetEntry from '../models/ScoresheetEntry'
import { NotFoundError, ApplicationError } from '../errors'

export const index = (req, res, next) => {
	console.log(req.query)
	ScoresheetEntry.find({
		tournament: req.params.tournamentId,
		division: req.query.division || /(B|C)/,
	})
		.populate('tournament event scores.team')
		.exec()
		.then(entries => {
			if (!entries) throw new NotFoundError('scoresheet entry')
			return res.json(entries)
		})
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	ScoresheetEntry.findOne({
		tournament: req.params.tournamentId,
		division: req.params.division,
		event: req.params.eventId,
	})
		.populate('tournament event scores.team')
		.exec()
		.then(entry => {
			if (!entry) throw new NotFoundError('scoresheet entry')
			return res.json(entry.toObject())
		})
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	ScoresheetEntry.findOne({
		tournament: req.params.tournamentId,
		division: req.params.division,
		event: req.params.eventId,
	})
		// .populate('tournament event scores.team') // TODO: should this data be populated server-side or client-side?
		.exec()
		.then(entry => {
			if (!entry) throw new NotFoundError('scoresheet entry')
			if (Object.keys(req.body).length !== 1 || !req.body.scores) {
				throw new ApplicationError(
					'Currently only scores may be modified for scoresheet entries.',
				)
			}
			entry.set(req.body)
			entry.rank((err, savedEntry) => {
				if (err) throw err
				ScoresheetEntry.findById(savedEntry._id)
					.populate('tournament event scores.team')
					.exec()
					.then(sheet => res.json(sheet))
					.catch(e => next(e))
			})
		})
		.catch(err => next(err))
}
// TODO: support manually creating/deleting scoresheet entries?
