import { Router } from 'express'
import { ensureAuthenticated, needsGroup, permitUnauthenticated } from '../passport/auth'
import { index, show, update } from '../controllers/scoresheets.controller'

const router = new Router({ mergeParams: true })

router.get('/', permitUnauthenticated, index)

router.get('/:division/:eventId', permitUnauthenticated, show)

router.patch(
	'/:division/:eventId',
	ensureAuthenticated,
	needsGroup('director', 'supervisor'),
	update,
)

export default router
