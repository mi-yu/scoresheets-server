import { Router } from 'express'
import { ensureAuthenticated, needsGroup } from '../passport/auth'
import {
	index,
	show,
	showMe,
	login,
	create,
	update,
	destroy,
} from '../controllers/users.controller'

const router = new Router()

/* GET users listing. */
router.get('/', ensureAuthenticated, needsGroup('admin'), index)

router.get('/me', ensureAuthenticated, showMe)

router.post('/', create)

router.get('/:userId', ensureAuthenticated, show)

router.patch('/:userId', ensureAuthenticated, needsGroup('admin'), update)

router.delete('/:userId', ensureAuthenticated, needsGroup('admin'), destroy)

router.post('/login', login)

export default router
