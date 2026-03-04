const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const seedData = require('./utils/seedData')

dotenv.config()
connectDB().then(() => seedData())

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/mood', require('./routes/moodRoutes'))
app.use('/api/quest', require('./routes/questRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/user', require('./routes/userRoutes'))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Mental XP server running on port ${PORT}`))