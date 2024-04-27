const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

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
    res.redirect('/');
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
            admin: false
    });
    await users.save()
    res.redirect('/login');
    }    catch(err)    {
        console.log(err)
        res.redirect('/signup');
    }
});

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
    res.redirect('/useracc');
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
        res.redirect('/useracc');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;