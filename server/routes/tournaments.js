import { Router } from 'express'
import { index, show, create, update, destroy } from '../controllers/tournaments.controller'
import { ensureAuthenticated, needsGroup, permitUnauthenticated } from '../passport/auth'

const router = new Router()

router.get('/', permitUnauthenticated, index)

router.post('/', ensureAuthenticated, create)

router.get('/:tournamentId', ensureAuthenticated, show)

router.patch('/:tournamentId', ensureAuthenticated, needsGroup('admin', 'director'), update)

router.delete('/:tournamentId', ensureAuthenticated, needsGroup('admin'), destroy)

export default router
