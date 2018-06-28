import { Router } from 'express'
import { index } from '../controllers/status.controller'
const router = new Router()

router.get('/', index)

export default router
