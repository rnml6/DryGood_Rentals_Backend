import pool from './database.js'

export const getAttires = async () => {
  const [rows] = await pool.query('SELECT * FROM rental_inventory')
  return rows
}
