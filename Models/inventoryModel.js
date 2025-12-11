import pool from './database.js'

export const getAttires = async () => {
  const [rows] = await pool.query('SELECT * FROM rental_inventory')
  return rows
}

export const addAttire = async attireData => {
    const {
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
    } = attireData
  
    const [result] = await pool.query(
      `INSERT INTO rental_inventory 
        (name, category, gender, size, color, price, material, status, date_added, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        gender,
        size,
        color,
        rentalPrice,
        material,
        status,
        dateAdded,
        description,
        img
      ]
    )
    return result
  }
