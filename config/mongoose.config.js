// Import mongoose >>> require mongoose
const mongoose = require('mongoose');

// Import dotenv
require('dotenv').config();

// ALT WAY of connecting mongoose to mongodb
// Using module.exports to export connect function
module.exports = (DB) => {
    
    // mongoose connect function using string interpolation 
    // Pass DB var from server.js through export function so it's available for us below
    mongoose.connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
        .then(() => console.log(
            `***** Connected to ${DB} DB! *****`))
        .catch(errObj => console.log(
            `***** RUH-RO! Something went wrong! *****`, errObj))
}
