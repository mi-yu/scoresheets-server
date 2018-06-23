import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show } from '../controllers/teams'

const router = new Router({ mergeParams: true })

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.get('/:teamId', show)

export default router
