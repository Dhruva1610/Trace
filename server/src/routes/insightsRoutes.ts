import { Router } from 'express'
import { getInsightsOverview, getInsightsActivity } from '../controllers/insightsController'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/overview', getInsightsOverview)
router.get('/activity', getInsightsActivity)

export default router
