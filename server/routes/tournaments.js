import { Router } from 'express'
import { index, show, create, update, destroy } from '../controllers/tournaments.controller'
import { ensureAuthenticated, needsGroup } from '../passport/auth'

const router = new Router()

router.all('*', ensureAuthenticated, needsGroup('admin'))

router.get('/', index)

router.post('/', create)

router.get('/:tournamentId', show)

router.patch('/:tournamentId', update)

router.delete('/:tournamentId', destroy)

export default router
