import * as RentalModel from '../Models/recordModel.js'
import * as InventoryModel from '../Models/inventoryModel.js'

export const createRentalRecord = async (req, res) => {
  try {
    const {
      attire_id,
      attire_name,
      price_of_rent,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      id_type,
      rental_date,
      expected_return_date,
      total_amount,
      rental_status
    } = req.body

    const id_image = req.file ? req.file.filename : null

    const newRental = await RentalModel.addRentalRecord({
      attire_id,
      attire_name,
      price_of_rent,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      id_type,
      id_image,
      rental_date,
      expected_return_date,
      total_amount,
      rental_status
    })

    await InventoryModel.updateInventoryStatus(attire_id, 'Rented')

    const createdRecord = {
      id: newRental.insertId,
      attire_id,
      attire_name,
      price_of_rent,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      id_type,
      id_image,
      rental_date,
      expected_return_date,
      total_amount,
      rental_status
    }

    return createdRecord
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchRecords = async (req, res) => {
  try {
    const attires = await RentalModel.getRentalRecords()
    res.status(200).json({ success: true, message: attires })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const editStatuses = async (req, res) => {
  const { attire_id } = req.body
  const { id } = req.params

  try {
    const updatedRecord = await RentalModel.updateRecordStatus(id, 'Returned')

    const updatedInventory = await InventoryModel.updateInventoryStatus(
      attire_id,
      'Available'
    )

    res.status(200).json({
      success: true,
      message: 'Statuses updated',
      updatedRecord,
      updatedInventory
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}


export const removeRecord = async (req, res) => {
  const { id } = req.params
  try {
    const deleteId = await RentalModel.deleteRecord(id)
    res.status(200).json({ success: true, message: deleteId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}