import { Router } from 'express'
import users from './users'
import tournaments from './tournaments'
import teams from './teams'
import events from './events'
import scoresheets from './scoresheets'
import status from './status'
import errorHandler from './errorHandler'
import { UnsupportedActionError } from '../errors'

const router = new Router()

router.use('/users', users)
router.use('/tournaments', tournaments)
router.use('/tournaments/:tournamentId/teams', teams)
router.use('/tournaments/:tournamentId/scoresheets', scoresheets)
router.use('/events', events)
router.use('/status', status)

router.use(errorHandler)
router.use((req, res) => res.status(400).json(new UnsupportedActionError()))

export default router
