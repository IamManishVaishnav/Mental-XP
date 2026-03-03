const express = require('express')
const router = express.Router()
const {
  getAdminStats,
  getAllUsers,
  addEmployee,
  toggleUserStatus,
  deleteUser,
  sendAlert,
  exportCSV,
} = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')

const admin = [protect, authorizeRoles('admin')]

router.get('/stats', ...admin, getAdminStats)
router.get('/users', ...admin, getAllUsers)
router.post('/users/add', ...admin, addEmployee)
router.patch('/users/:id/toggle', ...admin, toggleUserStatus)
router.delete('/users/:id', ...admin, deleteUser)
router.post('/users/:id/alert', ...admin, sendAlert)
router.get('/export', ...admin, exportCSV)

module.exports = router