import { Router } from 'express'
import { index, create, update, show, destroy } from '../controllers/events.controller'
import { ensureAuthenticated, needsGroup } from '../passport/auth'

const router = new Router()

router.get('/', index)

router.post('/', ensureAuthenticated, needsGroup('admin'), create)

router.get('/:eventId', show)

router.patch('/:eventId', ensureAuthenticated, needsGroup('admin'), update)

router.delete('/:eventId', ensureAuthenticated, needsGroup('admin'), destroy)

export default router
