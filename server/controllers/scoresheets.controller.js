import ScoresheetEntry from '../models/ScoresheetEntry'
import { NotFoundError, UnauthorizedError, ApplicationError } from '../errors'

// Helpers

const userIsTournamentSupervisor = (user, entry) => (
	user.group === 'supervisor'
	&& entry.supervisors.find(supervisor => supervisor.toString() === user.id)
)

const userIsTournamentDirector = (user, tournament) => (
	user.group === 'director'
	&& tournament.directors.find(director => director.toString() === user.id)
)

const canAccessScoresheet = (user, entry) => (
	entry.public || (
		user && (
			user.group === 'admin'
			|| userIsTournamentDirector(user, entry.tournament)
			|| userIsTournamentSupervisor(user, entry)
		)
	)
)

export const index = (req, res, next) => {
	ScoresheetEntry.find({
		tournament: req.params.tournamentId,
		division: req.query.division || /(B|C)/,
	})
		.populate('tournament event scores.team')
		.exec()
		.then(entries => {
			const filteredEntries = entries.filter(entry => canAccessScoresheet(req.user, entry))

			if (!filteredEntries) {
				throw new NotFoundError('scoresheet entry')
			}
			const entriesWithVirtuals = filteredEntries.map(entry => entry.toObject({ virtuals: true }))
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
			if (!canAccessScoresheet(req.user, entry)) throw new NotFoundError('scoresheet entry')
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
		.populate('tournament')
		// TODO: should this data be populated server-side or client-side?
		.exec()
		.then(entry => {
			if (
				!entry
				|| (
					req.user.group !== 'admin'
					&& !userIsTournamentDirector(req.user, entry.tournament)
					&& !userIsTournamentSupervisor(req.user, entry)
				)
			) {
				throw new UnauthorizedError()
			}

			if (entry.locked && req.body.scores) {
				throw new ApplicationError('Cannot modify locked scoresheet.')
			}

			if (req.body.locked) {
				req.body = {
					locked: true,
				}
			}

			entry.set(req.body)

			if (req.body.scores) {
				entry.rank((err, savedEntry) => {
					if (err) throw err
					ScoresheetEntry.findById(savedEntry._id)
						.populate('tournament event scores.team')
						.exec()
						.then(sheet => res.json(sheet.toObject({ virtuals: true })))
						.catch(e => next(e))
				})
			} else {
				entry.save()
					.then(() => res.json(entry.toObject({ virtuals: true })))
					.catch(e => next(e))
			}
		})
		.catch(err => next(err))
}
// TODO: support manually creating/deleting scoresheet entries?
