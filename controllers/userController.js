const User = require('../models/user.js');

module.exports.getsignup = async (req, res) => {
    res.render("../views/users/signup.ejs");
};

module.exports.postsignup = async (req, res) => {
    try{
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.getlogin = async (req, res) => {
    res.render("../views/users/login.ejs");
};

module.exports.postlogin = async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.getlogout = (req, res, next) => {
    req.logout( (err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
}