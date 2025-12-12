import * as InventoryModel from '../models/inventoryModel.js'

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

export const removeAttire = async (req, res) => {
  const { attireId } = req.params
  try {
    const deleteId = await InventoryModel.deleteAttire(attireId)
    res.status(200).json({ success: true, message: deleteId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const editAttire = async (req, res) => {
  const {
    name,
    category,
    gender,
    size,
    color,
    price,
    material,
    status,
    date_added,
    description
  } = req.body

  const { attireId } = req.params

  const image = req.file ? req.file.filename : null

  try {
    const updatedId = await InventoryModel.updateAttire(
      name,
      category,
      gender,
      size,
      color,
      price,
      material,
      status,
      date_added,
      description,
      image,
      attireId
    )

    res.status(200).json({ success: true, message: updatedId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
