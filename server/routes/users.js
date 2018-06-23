import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import { index, show, login, create, update, destroy } from '../controllers/users.controller'

const router = new Router()

/* GET users listing. */
router.get('/', ensureAuthenticated, needsGroup('admin'), index)

router.get('/:userId', ensureAuthenticated, show)

router.post('/login', login)

router.post('/register', create)

router.patch('/:userId', ensureAuthenticated, update)

router.delete('/:userId', ensureAuthenticated, needsGroup('admin'), destroy)

export default router
