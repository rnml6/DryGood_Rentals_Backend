import * as LoginModel from '../Models/loginModel.js'
import bcrypt from 'bcryptjs'

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  const users = await LoginModel.getUser(email)

  if (users.length === 0) {
    return res.status(400).json({ message: 'User not found' })
  }

  const user = users[0]

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(400).json({ message: 'Wrong password' })
  }

  return res.json({ success: true, message: 'Login success', user })
}

export const register = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await LoginModel.createUser(email, password)
    res.status(200).json({ success: true, message: user })
  } catch (e) {
    console.log(e)
    res.status(400).json({ success: false, message: e })
  }
}
