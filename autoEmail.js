import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmail (to, subject, html) {
  try {
    await transporter.sendMail({
      from: '"DRY GOOD RENTALS" <drygood-rentals@gmail.com>',
      to,
      subject,
      html
    })
    console.log(`Email sent to ${to}: ${subject}`)
  } catch (err) {
    console.error('Error sending email:', err)
  }
}
