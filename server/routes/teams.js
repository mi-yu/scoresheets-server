const router = require('express').Router()
const { ensureAuthenticated, needsGroup } = require('../passport/auth')
import { index } from '../controllers/teams'

router.get('/', index)

module.exports = router
