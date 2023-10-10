// Import mongoose
const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    vehicleRental: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '{PATH} is required'],
        ref: 'VehicleRental'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '{PATH} is required']
    },
    checkIn: {
        type: String,
        required: [true, '{PATH} is required']
    },
    checkOut: {
        type: String,
        required: [true, '{PATH} is required']
    },
    name: {
        type: String,
        required: [true, '{PATH} is required']
    },
    email: {
        type: String,
        required: [true, '{PATH} is required']
    },
    phoneNumber: {
        type: String
    },
    totalHours: {
        type: Number,
        required: [true, '{PATH} is required']
    },
    totalPrice: {
        type: Number,
        required: [true, '{PATH} is required']
    },
    transactionId: {
        type: String,
        required: [true, '{PATH} is required']
    }
}, { timestamps: true })


// Instantiate the user schema and export model
// >>> controller will then use user schema to make queries to the db & execute CRUD functions
const Booking = mongoose.model('Booking', bookingSchema)

// Exporting User Model
module.exports = Booking;