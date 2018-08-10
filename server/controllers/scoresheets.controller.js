import ScoresheetEntry from '../models/ScoresheetEntry'
import { NotFoundError, UnauthorizedError, ApplicationError } from '../errors'

// Helpers

const userIsTournamentSupervisor = (entry, user) => (user.group === 'supervisor' && entry.supervisors.includes(user._id))

const userIsTournamentDirector = (tournament, user) => (user.group === 'director' && tournament.directors.includes(user._id))

export const index = (req, res, next) => {
	ScoresheetEntry.find({
		tournament: req.params.tournamentId,
		division: req.query.division || /(B|C)/,
	})
		.populate('tournament event scores.team')
		.exec()
		.then(entries => {
			const canAccess = req.user.group === 'admin' || userIsTournamentDirector(entries[0].tournament, req.user)
			if (!entries || (!canAccess && !entries[0].tournament.public)) {
				throw new NotFoundError('scoresheet entry')
			}
			const entriesWithVirtuals = entries.map(entry => entry.toObject({ virtuals: true }))
			return res.json(entriesWithVirtuals)
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
			const canAccess = req.user.group === 'admin' || userIsTournamentDirector
			if (!entry || (!canAccess && !entry.public)) throw new NotFoundError('scoresheet entry')
			return res.json(entry.toObject({ virtuals: true }))
		})
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	ScoresheetEntry.findOne({
		tournament: req.params.tournamentId,
		division: req.params.division,
		event: req.params.eventId,
	})
		// .populate('tournament event scores.team')
		// TODO: should this data be populated server-side or client-side?
		.exec()
		.then(entry => {
			if (
				!entry
				|| (
					req.user.group !== 'admin'
					&& !userIsTournamentDirector(entry.tournament, req.user)
					&& !userIsTournamentSupervisor(entry, req.user)
				)
			) {
				throw new UnauthorizedError()
			}

			if (entry.locked && req.body.scores) {
				throw new ApplicationError('Cannot modify locked scoresheet.')
			}

			entry.set(req.body)
			entry.rank((err, savedEntry) => {
				if (err) throw err
				ScoresheetEntry.findById(savedEntry._id)
					.populate('tournament event scores.team')
					.exec()
					.then(sheet => res.json(sheet.toObject({ virtuals: true })))
					.catch(e => next(e))
			})
		})
		.catch(err => next(err))
}
// TODO: support manually creating/deleting scoresheet entries?
