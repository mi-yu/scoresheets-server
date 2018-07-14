import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show, update } from '../controllers/scoresheets.controller'

const router = new Router({ mergeParams: true })

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.get('/:division/:eventId', show)

router.patch('/:division/:eventId', update)

export default router
