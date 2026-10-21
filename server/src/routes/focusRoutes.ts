import { Router } from 'express'
import {
  getFocusSessions,
  createFocusSession,
  updateFocusSession,
  completeFocusSession,
  createFocusSessionSchema,
  updateFocusSessionSchema,
} from '../controllers/focusController'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

router.use(requireAuth)

router.get('/', getFocusSessions)
router.post('/', validate({ body: createFocusSessionSchema }), createFocusSession)
router.patch('/:id', validate({ body: updateFocusSessionSchema }), updateFocusSession)
router.post('/:id/complete', completeFocusSession)

export default router
