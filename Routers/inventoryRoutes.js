import express from 'express'
import * as InventoryController from '../Controllers/inventoryController.js'

const inventoryRoutes = express.Router()

inventoryRoutes.get('/all', InventoryController.fetchAttires)

export default inventoryRoutes