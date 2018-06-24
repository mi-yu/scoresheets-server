import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show, update } from '../controllers/scoresheets.controller'

const router = new Router({ mergeParams: true })

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.get('/:scoresheetId', show)

router.patch('/:scoresheetId', update)

export default router
