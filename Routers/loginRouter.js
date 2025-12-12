import * as LoginController from '../controllers/loginController.js'
import express from 'express'

const loginRoutes = express.Router()

loginRoutes.post('/login', LoginController.loginUser)
loginRoutes.post('/new', LoginController.register)

export default loginRoutes
