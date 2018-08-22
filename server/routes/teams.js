import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show, create, update, destroy } from '../controllers/teams.controller'

const router = new Router({ mergeParams: true })

router.get('/', index)

router.post('/', ensureAuthenticated, needsGroup('director'), create)

router.get('/:teamId', show)

router.patch('/:teamId', ensureAuthenticated, needsGroup('director'), update)

router.delete('/:teamId', ensureAuthenticated, needsGroup('director'), destroy)

export default router
