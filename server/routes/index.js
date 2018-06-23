import { Router } from 'express'
import users from './users'
import tournaments from './tournaments'
import teams from './teams'
import errorHandler from './errorHandler'

import errors from '../config/errors'
const { UNSUPPORTED_ACTION } = errors

const router = new Router()

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	)
	next()
})

router.use('/users', users)
router.use('/tournaments', tournaments)
router.use('/tournaments/:tournamentId/teams', teams)
// router.use('/scoresheets', scoresheets)
// router.use('/events', events)

router.use(errorHandler)
router.all('*', (req, res) => res.status(400).json(UNSUPPORTED_ACTION))

export default router
