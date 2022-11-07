const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const welcomeEmail =  () => {
    const msg = {
        to: 'damianswieboda07@gmail.com', // Change to your recipient
        from: 'damianswieboda07@gmail.com', // Change to your verified sender
        subject: 'Hello there',
        text: 'Hello from task manager',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    sgMail.send(msg)
}

module.exports = { welcomeEmail }