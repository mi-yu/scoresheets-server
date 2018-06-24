import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show, create, update, destroy } from '../controllers/teams.controller'

const router = new Router({ mergeParams: true })

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.post('/', create)

router.get('/:teamId', show)

router.patch('/:teamId', update)

router.delete('/:teamId', destroy)

export default router
