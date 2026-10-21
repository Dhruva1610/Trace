import { Router } from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
  createTaskSchema,
  updateTaskSchema,
  queryTaskSchema,
} from '../controllers/taskController'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

router.use(requireAuth)

router.get('/', validate({ query: queryTaskSchema }), getTasks)
router.post('/', validate({ body: createTaskSchema }), createTask)
router.get('/:id', getTaskById)
router.patch('/:id', validate({ body: updateTaskSchema }), updateTask)
router.patch('/:id/toggle', toggleTaskComplete)
router.delete('/:id', deleteTask)

export default router
