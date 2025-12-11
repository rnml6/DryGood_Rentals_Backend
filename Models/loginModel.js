import pool from './database.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export const getUser = async email => {
  const [rows] = await pool.query('SELECT * FROM user_login WHERE email = ?', [
    email
  ])
  return rows
}

export const createUser = async (email, password) => {
  if (email === '') {
    throw new Error('Invalid Email')
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format')
  }

  const [user] = await pool.query('SELECT * FROM user_login WHERE email = ?', [
    email
  ])

  if (user.length === 1) {
    throw new Error('Account already exist')
  }
  if (password === '') {
    throw new Error('Invalid Password')
  }

  const salt = bcrypt.genSaltSync(10)
  const newPassword = bcrypt.hashSync(password, salt)

  const [newUser] = await pool.query(
    'INSERT INTO user_login (email, password) VALUES(?,?)',
    [email, newPassword]
  )

  return newUser.insertId
}
