const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Express route handling the form submission
router.post('/send-email', async (req, res) => {
    // Fetch all emails from the database
    const userEmail = await User.find({}, { email: 1, _id: 0 });
        
    // Extract emails from userEmail and format them as a string
    const emailList = userEmail.map(userEmail => userEmail.email).join(', ');

    // Extract email details from the form submission
    const { subject, text } = req.body;

    // Create the mail options
    const mailOptions = {
        from: process.env.USER,
        to: emailList,
        subject: subject,
        text: text
    };

    // Send the email using Nodemailer transporter
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            req.flash('error', 'Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            req.flash('success', 'Email sent successfully');
        }
        res.redirect('/newsletter');
    });
});

module.exports = router;