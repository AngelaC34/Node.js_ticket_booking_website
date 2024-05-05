const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification');

const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');

require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// get all user
router.get('/', async (req, res) => {
    try
    {
        const user = await User.find();
        res.status(200).json(user);
    }
    catch (err)
    {
        res.status(500).json({message: err.message});
    }
});

// user login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    if (req.user && req.user.admin === true) {
        return res.redirect('/adminDashboard');
    }
    res.redirect('/home');
});

// user signup
router.post('/signup', async (req, res) => {
    try   {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const users = new User({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            admin: false,
            verified: false,
    });
    await users.save()
                .then((result) => {
                    // account verification
                    sendVerificationEmail(result, res)
                })
    res.redirect('/login');
    }    catch(err)    {
        console.log(err)
        res.redirect('/signup');
    }
});

// Verification Function
const sendVerificationEmail = ({_id, email}, res) => {
    const currentUrl = 'https://localhost:3000/';
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.dotenv.USER,
        to: email,
        subject: "Verify your email",
        html: '<p>Verify your email address to complete signup and login the page</p><p>This link <b>expires in six hours<b></p><p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here<a> to proceed</p>'
    }; 

    const saltRounds = 10;
    bycrypt.hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000
        });
        newVerification
        .save()
        .then(() => {
            transporter.sendMail(mailOptions)
            .then(() => {
                res.json({
                    status: 'PENDING',
                    message: "Verification email sent",
                });
            })
            .catch((error) => {
                console.log(error);
                res.json({
                    status: 'FAILED',
                    message: "Verification email failed",
                });
            })
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: 'FAILED',
                message: "Couldn't save verification email data!",
            });
        })
    })
    .catch(() => {
        res.json({
            status: 'FAILED',
            message: 'An error occured while hashing email data',
        })
    })
};

router.delete('/logout', (req, res, next) => {
    req.logOut(function
    (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// Delete user
router.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.redirect('/useraccount');
});

// user update
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, admin } = req.body; // Assuming you want to update name and email

    try {
        // Use your User model to find and update the user
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, admin }, { new: true });
        console.log(updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/useraccount');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;