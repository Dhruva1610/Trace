import { Router } from 'express'
import {
  getPreferences,
  updatePreferences,
  updatePreferencesSchema,
} from '../controllers/preferencesController'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

router.use(requireAuth)

router.get('/', getPreferences)
router.patch('/', validate({ body: updatePreferencesSchema }), updatePreferences)

export default router
