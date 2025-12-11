import * as InventoryModel from '../Models/inventoryModel.js'

export const fetchAttires = async (req, res) => {
    try {
      const attires = await InventoryModel.getAttires()
      res.status(200).json({ success: true, message: attires })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      })
    }
  }

  export const createAttire = async (req, res) => {
  try {
    const {
      name,
      category,
      gender,
      size,
      color,
      rentalPrice,
      material,
      status,
      dateAdded,
      description
    } = req.body
    const img = req.file ? req.file.filename : null

    const newAttire = await InventoryModel.addAttire({
      name,
      category,
      gender,
      size,
      color,
      rentalPrice,
      material,
      status,
      img,
      dateAdded,
      description
    })

    res.status(201).json({
      success: true,
      message: 'Attire added successfully',
      id: newAttire.insertId
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error
    })
  }
}
