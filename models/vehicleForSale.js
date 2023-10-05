const mongoose = require('mongoose');

const vehicleForSaleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    year: {
        type: Number,
        required: [true, "{PATH} is required"],
        min: [2010, "{PATH} must be 2010 or newer"],
        max: [2023, "{PATH} must be 2023 or older"]
    },
    make: {
        type: String,
        required: [true, "{PATH} is required"],
        minLength: [2, "{PATH} must be at least 2 characters in length"],
        maxLength: [10, "{PATH} must be no more than 10 characters in length"]
    },
    model: {
        type: String,
        required: [true, "{PATH} is required"],
        minLength: [2, "{PATH} must be at least 2 characters"],
        maxLength: [20, "{PATH} must be no more than 20 characters"]
    },
    photos: {
        type: [String],
        required: [true, '{PATH} is required']
    },
    mileage: {
        type: Number,
        required: [true, "{PATH} is required"]
    },
    avgMPG: {
        type: Number,
        required: [true, "{PATH} is required"],
        min: [10, "{PATH} must be at least 10 mpg"],
        max: [70, "{PATH} must be no more than 70 mpg"]
    },
    doors: {
        type: Number,
        required: [true, "Number of {PATH} is required"],
        min: [2, "Number of {PATH} must be at least 2"],
        max: [6, "Number of {PATH} must be no more than 6"]
    },
    fuelType: {
        type: String,
        required: [true, "{PATH} is required"]
    },
    seats: {
        type: Number,
        required: [true, "Number of {PATH} is required"],
        min: [2, "Number of {PATH} must be at least 2"],
        max: [20, "Number of {PATH} must be no more than 20"]
    },
    description: {
        type: String,
        required: [true, "{PATH} is required"],
        minLength: [10, "{PATH} must be at least 10 characters in length"],
        maxLength: [500, "{PATH} must be no more than 500 characters in length"]
    },
    features: {
        type: [String],
        required: [true, "{PATH} are required"]
    },
    cityAddress: {
        type: String,
        required: [true, "{PATH} is required"],
        minLength: [4, "{PATH} must be at least 4 characters"],
        maxLength: [50, "{PATH} must be no more than 50 characters"]
    },
    mapLocation: {
        type: String,
        required: [true, "{PATH} is required"],
        minLength: [5, "{PATH} must be at least 5 characters"],
        maxLength: [100, "{PATH} must be no more than 100 characters"]
    },
    mapImage: {
        type: String,
        required: [true, "{PATH} is required"]
    },
    salePrice: {
        type: Number,
        required: [true, "{PATH} is required"],
        min: [3000, "{PATH} must be at least $3000"],
        max: [100000, "{PATH} cannot exceed $100000"]
    }

},  { timestamps: true })



// Instantiate the user schema and export model
// >>> controller will then use user schema to make queries to the db & execute CRUD functions
const VehicleForSale = mongoose.model('VehicleForSale', vehicleForSaleSchema);

// Exporting User Model
module.exports = VehicleForSale;