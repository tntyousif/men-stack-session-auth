/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();


router.get("/sign-up", async (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const existingUser = await User.findOne({ username});
    if (existingUser) {
        return res.send("Username is taken");
    }

    if (password  !== confirmPassword) {
        return res.send ("password don't mattch");
    }

    //make password secure
    const hashPassword = auth.encryptPassword(password);
    
    const newUser = await User.create({username, password:hashPassword });

    res.send(`Thanks for signing up ${newUser.username}`);
});


module.exports = router;