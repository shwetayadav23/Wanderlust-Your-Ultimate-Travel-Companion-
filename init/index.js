const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listingss.js');

main().then(res => {
    console.log("connection succesful");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: '67b767d78094a6f184ff0f8a'
    }));
    await Listing.insertMany(initdata.data);
    console.log("data initialized");
};

initDB();