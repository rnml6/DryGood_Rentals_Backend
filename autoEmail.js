import nodemailer from 'nodemailer'
import fetch from 'node-fetch'

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

async function sendEmailToMultiple (recipients, subject, html) {
  try {
    const recipientsArray = Array.isArray(recipients)
      ? recipients
      : [recipients]

    for (const recipient of recipientsArray) {
      await sendEmail(recipient, subject, html)
    }
  } catch (err) {
    console.error('Error sending email to multiple recipients:', err)
  }
}

export async function sendEmailForRecord (record) {
  try {
    if (!record || !record.customer_email || !record.expected_return_date)
      return

    const ownerEmail = 'andayaronmel@gmail.com'
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const returnDate = new Date(record.expected_return_date)
    returnDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((returnDate - today) / (1000 * 60 * 60 * 24))

    let subject = null
    let customerHtml = null
    let ownerHtml = null

    if (diffDays === 1) {
      subject = 'Rental Due Reminder'
      customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>This is a friendly reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
        record.attire_id
      }) is due tomorrow (${returnDate.toLocaleDateString()}).</p>
          <p>Please make sure to return it on time to avoid overdue fees.</p>
          <p>Thank you!</p>`

      ownerHtml = `<p>Rental Due Tomorrow</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
        record.attire_id
      })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Status: Due tomorrow</p>`
    }

    if (diffDays === 0) {
      subject = 'Rental Due Today'
      customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>This is a reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
        record.attire_id
      }) is due today (${returnDate.toLocaleDateString()}).</p>
          <p>Please return it to avoid overdue fees.</p>
          <p>Thank you!</p>`

      ownerHtml = `<p>Rental Due Today</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
        record.attire_id
      })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Status: Due today</p>`
    }

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays)
      const overdueFee = overdueDays * 250

      subject = 'Rental Overdue Notice'
      customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>Your rental <strong>${record.attire_name}</strong> (ID: ${
        record.attire_id
      }) is overdue by ${overdueDays} day(s).</p>
          <p>Current overdue fee: ₱${overdueFee.toLocaleString()}.</p>
          <p>Please return your rental as soon as possible.</p>`

      ownerHtml = `<p>Rental Overdue</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
        record.attire_id
      })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Overdue by: ${overdueDays} day(s)</p>
          <p>Overdue fee: ₱${overdueFee.toLocaleString()}</p>
          <p>Status: Overdue</p>`
    }

    if (!subject) return

    await sendEmail(record.customer_email, subject, customerHtml)

    const ownerSubject = `[Owner] ${subject} - ${record.customer_name}`
    await sendEmail(ownerEmail, ownerSubject, ownerHtml)
  } catch (err) {
    console.error('Error sending email for record:', err)
  }
}

export async function checkAndSendEmails () {
  try {
    const res = await fetch('http://localhost:4000/record/all')
    const data = await res.json()
    const records = data.message || []

    const ownerEmail = 'andayaronmel@gmail.com'
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const record of records) {
      if ((record.rental_status || '').toLowerCase() !== 'active') continue
      if (!record.expected_return_date || !record.customer_email) continue

      const returnDate = new Date(record.expected_return_date)
      returnDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((returnDate - today) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        const subject = 'Rental Due Reminder'
        const customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>This is a friendly reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
          record.attire_id
        }) is due tomorrow (${returnDate.toLocaleDateString()}).</p>
          <p>Please make sure to return it on time to avoid overdue fees.</p>
          <p>Thank you!</p>`

        const ownerHtml = `<p>Rental Due Tomorrow</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Status: Due tomorrow</p>`

        await sendEmail(record.customer_email, subject, customerHtml)
        await sendEmail(
          ownerEmail,
          `[Owner] ${subject} - ${record.customer_name}`,
          ownerHtml
        )
      }

      if (diffDays === 0) {
        const subject = 'Rental Due Today'
        const customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>This is a reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
          record.attire_id
        }) is due today (${returnDate.toLocaleDateString()}).</p>
          <p>Please return it to avoid overdue fees.</p>
          <p>Thank you!</p>`

        const ownerHtml = `<p>Rental Due Today</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Status: Due today</p>`

        await sendEmail(record.customer_email, subject, customerHtml)
        await sendEmail(
          ownerEmail,
          `[Owner] ${subject} - ${record.customer_name}`,
          ownerHtml
        )
      }

      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays)
        const overdueFee = overdueDays * 250
        const subject = 'Rental Overdue Notice'
        const customerHtml = `<p>Hi ${record.customer_name},</p>
          <p>Your rental <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        }) is overdue by ${overdueDays} day(s).</p>
          <p>Current overdue fee: ₱${overdueFee.toLocaleString()}.</p>
          <p>Please return your rental as soon as possible.</p>`

        const ownerHtml = `<p>Rental Overdue</p>
          <p>Customer: ${record.customer_name}</p>
          <p>Contact Number: ${record.customer_phone}</p>
          <p>Email: ${record.customer_email}</p>
          <p>Rental: <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        })</p>
          <p>Due Date: ${returnDate.toLocaleDateString()}</p>
          <p>Overdue by: ${overdueDays} day(s)</p>
          <p>Overdue fee: ₱${overdueFee.toLocaleString()}</p>
          <p>Status: Overdue</p>`

        await sendEmail(record.customer_email, subject, customerHtml)
        await sendEmail(
          ownerEmail,
          `[Owner] ${subject} - ${record.customer_name}`,
          ownerHtml
        )
      }
    }
  } catch (err) {
    console.error('Error fetching records for email:', err)
  }
}

setInterval(checkAndSendEmails, 24 * 60 * 60 * 1000)
