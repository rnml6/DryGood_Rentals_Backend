import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import pool from './Models/database.js'
import loginRoutes from './Routers/loginRouter.js'
import RecordRoutes from './Routers/recordRoutes.js'


const app = express()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection()
    connection.release()

    res.json({
      success: true,
      message: 'Server is running and MySQL is connected!'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server is running but MySQL connection failed.',
      error: err.message
    })
  }
})

try {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}...`)
  })
} catch (error) {
  console.log(error)
}

app.use('/user', loginRoutes)
app.use('/record', RecordRoutes)
