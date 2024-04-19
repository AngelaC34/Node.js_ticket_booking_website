const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Express route handling the form submission
router.post('/send-email', (req, res) => {
    // Extract email details from the form submission
    const { toEmail, subject, text } = req.body;

    // Create the mail options
    const mailOptions = {
        from: process.env.USER,
        to: toEmail,
        subject: subject,
        text: text
    };

    // Send the email using Nodemailer transporter
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

module.exports = router;