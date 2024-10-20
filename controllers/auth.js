/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();

//sign up
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

//sign in
router.get('/sign-in', (req, res) =>{
    res.render('auth/sign-in.ejs')
});

router.post('/sign-in', async (req, res) => {
const username = req.body.username;
const password = req.body.password;

const user = await User.findOne({username});
if (!user) {
    return res.send('Login failed. Please try again.');
}

const validPassword = auth.comparePassword(password, user.password);
if (!validPassword) {
    return res.send("Login failed. Please try again.");
}

//creat session cookis
req.session.user = {
    username: user.username,
}
req.session.save(() => {
    res.redirect("/");
  });
});

//sign out
router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
      });
});

module.exports = router;