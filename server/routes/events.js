import { Router } from 'express'
import { index, create, update, show, destroy } from '../controllers/events.controller'
import { ensureAuthenticated, needsGroup } from '../passport/auth'

const router = new Router()

router.all('*', ensureAuthenticated)

router.get('/', index)

router.post('/', needsGroup('admin'), create)

router.get('/:eventId', show)

router.patch('/:eventId', needsGroup('admin'), update)

router.delete('/:eventId', needsGroup('admin'), destroy)

export default router
