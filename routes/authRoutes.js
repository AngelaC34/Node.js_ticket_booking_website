const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET semua User
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

// Login User
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    if (req.user && req.user.admin === true) {
        return res.redirect('/adminDashboard');
    }
    res.redirect('/home');
});

// SignUp User
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
        res.redirect('/login');
    }
});

// LogOut User
router.delete('/logout', (req, res, next) => {
    req.logOut(function
    (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// Delete User
router.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            req.flash('error', 'User not found');
            return res.redirect('/useraccount');
        }
        req.flash('success', 'User deleted successfully');
        res.redirect('/useraccount');
    } catch (err) {
        req.flash('error', 'Failed to delete user');
        res.redirect('/useraccount');
    }
});

// Update User
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, admin } = req.body; 

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, admin }, { new: true });
        if (!updatedUser) {
            req.flash('error', 'User not found');
            return res.redirect('/useraccount');
        }
        req.flash('success', 'User updated successfully');
        res.redirect('/useraccount');
    } catch (err) {
        req.flash('error', 'Failed to update user');
        res.redirect('/useraccount');
    }
});

module.exports = router;