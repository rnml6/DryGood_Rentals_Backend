import express from 'express'
import multer from 'multer'
import path from 'path'
import * as RentalController from '../controllers/recordController.js'
import { sendEmailForRecord } from '../autoEmail.js'

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

rentalRoutes.get('/all', RentalController.fetchRecords)
rentalRoutes.put('/edit/:id', RentalController.editStatuses)
rentalRoutes.put('/edit/total/:id', RentalController.updateRecordTotal)
rentalRoutes.delete('/delete/:id', RentalController.removeRecord)

rentalRoutes.post('/new', upload.single('id_image'), async (req, res) => {
  try {
    const createdRecord = await RentalController.createRentalRecord(req)

    await sendEmailForRecord(createdRecord)

    res.status(201).json({
      success: true,
      message: 'Rental record added successfully',
      data: createdRecord
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

export default rentalRoutes
