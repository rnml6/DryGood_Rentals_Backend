import pool from './database.js'

export const addRentalRecord = async rentalData => {
  const {
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
  } = rentalData

  const [result] = await pool.query(
    `INSERT INTO rental_record 
        (attire_id, attire_name, price, customer_name, customer_phone, customer_email, customer_address, id_type, id_image, rental_date, expected_return_date, total_amount, rental_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ]
  )

  return result
}

export const getRentalRecords = async () => {
  const [rows] = await pool.query('SELECT * FROM rental_record')
  return rows
}

export const updateRecordStatus = async (id, status) => {
    const [result] = await pool.query(
      `UPDATE rental_record SET rental_status = ? WHERE id = ?`,
      [status, id]
    )
    return result
  }

export const deleteRecord = async id => {
  const [result] = await pool.query('DELETE FROM rental_record WHERE id= ?', [
    id
  ])
  return result.affectedRows
}