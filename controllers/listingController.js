const Listing = require('../models/listingss');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/form.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings"); 
};

module.exports.getupdateListingForm = async (req, res) => {
    let { id } = req.params;
    let tobeupdatedListing = await Listing.findById(id);
    if(!tobeupdatedListing){
        req.flash("error", "Listing you're trying to update does not exist.");
        res.redirect("/listings");
    }
    let originalImageUrl = tobeupdatedListing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { tobeupdatedListing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let s = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        s.image = { url, filename };
        await s.save();
    }
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`); 
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!list){
        req.flash("error", "Listing you requested for does not exist.");
        res.redirect("/listings");
    }
    // console.log(list);
    res.render("listings/show.ejs", { list });
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}