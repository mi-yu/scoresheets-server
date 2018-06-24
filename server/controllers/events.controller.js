import Event from '../models/Event'
import { NotFoundError } from '../errors'

export const index = (req, res, next) => {
	Event.find()
		.exec()
		.then(events => res.json([...events]))
		.catch(err => next(err))
}

export const show = (req, res, next) => {
	Event.findById(req.params.eventId)
		.exec()
		.then(event => {
			if (!event) return next(new NotFoundError('event'))
			return res.json(event.toObject())
		})
		.catch(err => next(err))
}

export const create = (req, res, next) => {
	const event = new Event({
		...req.body,
	})

	event
		.save()
		.then(newEvent => res.status(201).json(newEvent.toObject()))
		.catch(err => next(err))
}

export const update = (req, res, next) => {
	Event.findById(req.params.eventId)
		.exec()
		.then(event => {
			if (!event) return next(new NotFoundError('team'))
			event.set(req.body)
			return event.save()
		})
		.then(updated => res.status(200).json(updated.toObject()))
		.catch(err => next(err))
}

export const destroy = (req, res, next) => {
	Event.findById(req.params.eventId)
		.exec()
		.then(event => {
			if (!event) return next(new NotFoundError('team'))
			return event.remove()
		})
		.then(deletedEvent => res.json(deletedEvent.toObject()))
		.catch(err => next(err))
}
