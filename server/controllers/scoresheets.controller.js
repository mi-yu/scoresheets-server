import ScoresheetEntry from '../models/ScoresheetEntry'
import { NotFoundError, ApplicationError } from '../errors'

export const index = (req, res, next) => {
	ScoresheetEntry.find({
		tournament: req.params.tournamentId,
	})
		.exec()
		.then(entries => {
			if (!entries) throw new NotFoundError('scoresheet entry')
			return res.json(entries)
		})
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	ScoresheetEntry.findById(req.params.scoresheetId)
		.exec()
		.then(entry => {
			if (!entry) throw new NotFoundError('scoresheet entry')
			return res.json(entry.toObject())
		})
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	ScoresheetEntry.findById(req.params.scoresheetId)
		.populate('tournament event scores.team') // TODO: should this data be populated server-side or client-side?
		.exec()
		.then(entry => {
			if (!entry) throw new NotFoundError('scoresheet entry')
			if (req.body.length !== 1 || !req.body.scores) {
				throw new ApplicationError(
					'Currently only scores may be modified for scoresheet entries.',
				)
			}
			entry.set(req.body)
			return entry.save()
		})
		.then(savedEntry => res.json(savedEntry.toObject()))
		.catch(err => next(err))
}
// TODO: support manually creating/deleting scoresheet entries?
