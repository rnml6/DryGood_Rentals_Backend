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