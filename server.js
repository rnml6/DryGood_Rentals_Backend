import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'

const app = express()

app.use(cors())
app.use(express.json())

try {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}...`)
  })
} catch (error) {
  console.log(error)
}
