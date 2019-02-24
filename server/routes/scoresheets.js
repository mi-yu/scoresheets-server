import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { validateScoresheet, whitelistParams } from '../middleware/scoresheets.mw'
import { index, show, update } from '../controllers/scoresheets.controller'

const router = new Router({ mergeParams: true })

router.get('/', ensureAuthenticated, index)

router.get('/:division/:eventId', ensureAuthenticated, show)

router.patch(
	'/:division/:eventId',
	ensureAuthenticated,
	needsGroup('director', 'supervisor'),
	whitelistParams('scores', 'locked', 'public'),
	validateScoresheet,
	update,
)

export default router
