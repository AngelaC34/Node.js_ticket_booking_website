const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// POST Send Email
router.post('/send-email', async (req, res) => {
    const userEmail = await User.find({}, { email: 1, _id: 0 });
    const emailList = userEmail.map(userEmail => userEmail.email).join(', ');
    const { subject, text } = req.body;

    const mailOptions = {
        from: process.env.USER,
        to: emailList,
        subject: subject,
        text: text
    };

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