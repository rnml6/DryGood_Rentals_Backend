import pool from './database.js'

export const getUser = async email => {
    const [rows] = await pool.query('SELECT * FROM user_login WHERE email = ?', [
      email
    ])
    return rows
  }