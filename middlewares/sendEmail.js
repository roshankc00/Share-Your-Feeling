const nodemailer=require("nodemailer")

const sendEmail=async(options)=>{
    console.log(options)
    let testAccount = await nodemailer.createTestAccount();
    
   
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b35d59287c4a69",
          pass: "fa0ee13e72b41d"
        }
      });
    
  const mailOption={
    from:"roshankc8848@gmail.com",
    to:options.email,
    subject:options.subject,
    text:options.message
  }
  await transporter.sendMail(mailOption)
} 
module.exports={
    sendEmail
}