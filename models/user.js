// Import mongoose
const mongoose = require('mongoose');


// The user schema - rules that user entries into db must follow
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, '{PATH} is required'],
        min: [2, '{PATH} must be at least 2 characters long'],
        max: [20, '{PATH} must be no more than 20 characters long']
    },
    lastName: {
        type: String,
        required: [true, '{PATH} is required'],
        min: [2, '{PATH} must be at least 2 characters long'],
        max: [20, '{PATH} must be no more than 20 characters long']
    },
    email: {
        type: String,
        required: [true, '{PATH} is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, '{PATH} is required'],
        min: [8, '{PATH} must be at least 8 characters long'],
        max: [20, '{PATH} must be no more than 20 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true })


// Instantiate the user schema and export model
// >>> controller will then use user schema to make queries to the db & execute CRUD functions
const User = mongoose.model('User', userSchema);

// Exporting User Model
module.exports = User;