const Listing = require('./models/listingss.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema }  = require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let s = await Listing.findById(id);
    if(!s.owner.equals(res.locals.currUser._id)){ 
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let s = await Review.findById(reviewId);
    if(!s.author.equals(res.locals.currUser._id)){ 
        req.flash("error", "You didn't create this review!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}