const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/userController.js');

router
    .route("/signup")
    .get(userController.getsignup)
    .post(wrapAsync(userController.postsignup));

router
    .route("/login")
    .get(userController.getlogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.postlogin);

router.get("/logout", userController.getlogout);

module.exports = router;