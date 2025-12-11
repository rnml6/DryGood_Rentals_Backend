import express from 'express'
import multer from 'multer'
import path from 'path'
import * as InventoryController from './Controllers/inventoryController.js'

const inventoryRoutes = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    )
  }
})

const upload = multer({ storage })

inventoryRoutes.get('/all', InventoryController.fetchAttires)
inventoryRoutes.post(
  '/new',
  upload.single('img'),
  InventoryController.createAttire
)

export default inventoryRoutes
