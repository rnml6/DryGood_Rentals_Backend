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

export async function sendEmailForRecord (record) {
    try {
      if (!record || !record.customer_email || !record.expected_return_date)
        return
  
      const today = new Date()
      today.setHours(0, 0, 0, 0)
  
      const returnDate = new Date(record.expected_return_date)
      returnDate.setHours(0, 0, 0, 0)
  
      const diffDays = Math.floor((returnDate - today) / (1000 * 60 * 60 * 24))
  
      let subject = null
      let html = null
  
      if (diffDays === 1) {
        subject = 'Rental Due Reminder'
        html = `<p>Hi ${record.customer_name},</p>
            <p>This is a friendly reminder that your rental <strong>${
              record.attire_name
            }</strong> (ID: ${
          record.attire_id
        }) is due tomorrow (${returnDate.toLocaleDateString()}).</p>
            <p>Please make sure to return it on time to avoid overdue fees.</p>
            <p>Thank you!</p>`
      }
  
      if (diffDays === 0) {
        subject = 'Rental Due Today'
        html = `<p>Hi ${record.customer_name},</p>
            <p>This is a reminder that your rental <strong>${
              record.attire_name
            }</strong> (ID: ${
          record.attire_id
        }) is due today (${returnDate.toLocaleDateString()}).</p>
            <p>Please return it to avoid overdue fees.</p>
            <p>Thank you!</p>`
      }
  
      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays)
        const overdueFee = overdueDays * 250
  
        subject = 'Rental Overdue Notice'
        html = `<p>Hi ${record.customer_name},</p>
            <p>Your rental <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        }) is overdue by ${overdueDays} day(s).</p>
            <p>Current overdue fee: ₱${overdueFee.toLocaleString()}.</p>
            <p>Please return your rental as soon as possible.</p>`
      }
  
      if (!subject) return
  
      await sendEmail(record.customer_email, subject, html)
    } catch (err) {
      console.error('Error sending email for record:', err)
    }
  }

  export async function checkAndSendEmails () {
  try {
    const res = await fetch('http://localhost:4000/record/all')
    const data = await res.json()
    const records = data.message || []

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
        const html = `<p>Hi ${record.customer_name},</p>
          <p>This is a friendly reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
          record.attire_id
        }) is due tomorrow (${returnDate.toLocaleDateString()}).</p>
          <p>Please make sure to return it on time to avoid overdue fees.</p>
          <p>Thank you!</p>`
        await sendEmail(record.customer_email, subject, html)
      }

      if (diffDays === 0) {
        const subject = 'Rental Due Today'
        const html = `<p>Hi ${record.customer_name},</p>
          <p>This is a reminder that your rental <strong>${
            record.attire_name
          }</strong> (ID: ${
          record.attire_id
        }) is due today (${returnDate.toLocaleDateString()}).</p>
          <p>Please return it to avoid overdue fees.</p>
          <p>Thank you!</p>`
        await sendEmail(record.customer_email, subject, html)
      }

      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays)
        const overdueFee = overdueDays * 250
        const subject = 'Rental Overdue Notice'
        const html = `<p>Hi ${record.customer_name},</p>
          <p>Your rental <strong>${record.attire_name}</strong> (ID: ${
          record.attire_id
        }) is overdue by ${overdueDays} day(s).</p>
          <p>Current overdue fee: ₱${overdueFee.toLocaleString()}.</p>
          <p>Please return your rental as soon as possible.</p>`
        await sendEmail(record.customer_email, subject, html)
      }
    }
  } catch (err) {
    console.error('Error fetching records for email:', err)
  }
}