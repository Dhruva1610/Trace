import { Router } from 'express'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createProjectSchema,
  updateProjectSchema,
  queryProjectSchema,
} from '../controllers/projectController'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

// All project routes require authenticated session
router.use(requireAuth)

router.get('/', validate({ query: queryProjectSchema }), getProjects)
router.post('/', validate({ body: createProjectSchema }), createProject)
router.get('/:id', getProjectById)
router.patch('/:id', validate({ body: updateProjectSchema }), updateProject)
router.delete('/:id', deleteProject)

export default router
