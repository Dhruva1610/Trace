import { Router } from 'express'
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../controllers/authController'
import { validate } from '../middleware/validate'
import { requireAuth } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/register', authLimiter, validate({ body: registerSchema }), register)
router.post('/login', authLimiter, validate({ body: loginSchema }), login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, getMe)
router.patch('/change-password', requireAuth, validate({ body: changePasswordSchema }), changePassword)
router.post('/forgot-password', authLimiter, validate({ body: forgotPasswordSchema }), forgotPassword)
router.post('/reset-password', authLimiter, validate({ body: resetPasswordSchema }), resetPassword)

export default router
