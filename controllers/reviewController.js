const Listing = require("../models/listingss.js");
const Review = require("../models/review.js");

module.exports.postReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;
    let s = Review.findById(id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}