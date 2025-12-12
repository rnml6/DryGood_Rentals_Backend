import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import loginRoutes from './routers/loginRouter.js'
import inventoryRoutes from './routers/inventoryRoutes.js'
import RecordRoutes from './routers/recordRoutes.js'
import path from 'path'
import { checkAndSendEmails } from './autoEmail.js'

const app = express()
checkAndSendEmails()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')))
app.use('/recordsId', express.static(path.join(path.resolve(), 'recordsId')))

try {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}...`)
  })
} catch (error) {
  console.log(error)
}

app.use('/user', loginRoutes)
app.use('/inventory', inventoryRoutes)
app.use('/record', RecordRoutes)
