import {createTransport} from 'nodemailer';

const sendEmail = async({from, to, subject, html}) =>{

  try {
    let mailOptions = ({
      from,
      to,
      subject,
      html
  })
  
  const Transporter = createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });

    return await Transporter.sendMail(mailOptions) 
  } catch (error) {
    console.log(error)
    throw error
  }
    
}

export default sendEmail;
