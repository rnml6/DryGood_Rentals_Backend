import express from 'express'
import multer from 'multer'
import path from 'path'
import * as RentalController from '../Controllers/recordController.js'

const rentalRoutes = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'recordsId')      
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    )
  }
})

const upload = multer({ storage })

rentalRoutes.post('/new', upload.single('id_image'), async (req, res) => {
  try {
    const newRecord = await RentalController.createRentalRecord(req)

    return res.status(201).json({
      success: true,
      message: 'Rental record created successfully',
      data: newRecord
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default rentalRoutes  
