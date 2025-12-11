import * as RentalModel from '../models/recordModel.js'
import * as InventoryModel from '../models/inventoryModel.js'

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