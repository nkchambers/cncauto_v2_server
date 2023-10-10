// IMPORT MODEL >>> controller to use when performing CRUD functions
const VehicleRental = require('../models/vehicleRental');

// IMPORT Booking Model
const Booking = require('../models/booking');

// IMPORT User Model
const User = require('../models/user');

// // IMPORT multer
// const multer = require('multer');

// // Multer upload funcionality
// const photosMiddleware = multer({ dest: 'uploads' });

// IMPORT image-downloader
const imageDownloader = require('image-downloader');

// IMPORT fs - file system library
const fs = require('fs');

// IMPORT jsonwebtoken
const jwt = require('jsonwebtoken');

// IMPORT Bcryptjs for password protection
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'naln4wlsknos5clasm8flw2sel';

// IMPORT Stripe
const stripe = require('stripe')('sk_test_51McbK7EoEvigZp72NE7nxjntkhrEn1vYrryYSqHzD0lPcBNRbSQ80VGq4WD59r70vJCeu8crmhGdiJi1s5JbVnzP00wfddr71D');

// IMPORT uuid
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


// GRAB USER DATA FUNCTION
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}


// ------------------------- CRUD Functions ------------------------ 
// >>> export functions with module.exports to send as object
// Keys will be name of function : Values will be function itself


module.exports = {

    // CREATE new vehicle rental
    createVehicleRental: async (req, res) => {

        const { token } = req.cookies;
        const {
            year,
            make,
            model,
            addedPhotos,
            experience,
            avgMPG,
            doors,
            fuelType,
            seats,
            description,
            features,
            streetAddress,
            cityAddress,
            mapLocation,
            mapImage,
            pricePerDay
        } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;

            const vehicleRentalDoc = await VehicleRental.create({
                owner: userData.id,
                year,
                make,
                model,
                addedPhotos,
                experience,
                avgMPG,
                doors,
                fuelType,
                seats,
                description,
                features,
                streetAddress,
                cityAddress,
                mapLocation,
                mapImage,
                pricePerDay
            });

            res.json(vehicleRentalDoc);
        });
    },

    // ADD vehicle rental images by link
    imageDownloader: async (req, res) => {

        const { link } = req.body;
        const newName = 'photo' + Date.now() + '.jpg';

        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        res.json(newName);
    },

    // UPLOAD added vehicle rental images
    imageUpload: (req, res) => {
        const uploadedFiles = [];

        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path + '.' + ext;

            fs.renameSync(path, newPath);
            uploadedFiles.push(newPath.replace('uploads\\', ''));
        }
        res.json(uploadedFiles);
    },

    // READ ALL vehicle rentals 
    allVehicleRentals: async (req, res) => {
        res.json(await VehicleRental.find());
    },

    // READ ALL sedan rentals 
    allSedanRentals: async (req, res) => {
        res.json(await VehicleRental.find({ experience: 'Sedan' }));
    },

    // READ ALL sedan rentals 
    allVanRentals: async (req, res) => {
        res.json(await VehicleRental.find({ experience: 'Van' }));
    },

    // READ ALL truck rentals 
    allTruckRentals: async (req, res) => {
        res.json(await VehicleRental.find({ experience: 'Truck' }));
    },

    // READ ALL truck rentals 
    allSuvRentals: async (req, res) => {
        res.json(await VehicleRental.find({ experience: 'SUV' }));
    },

    // READ ALL Seattle rentals 
    allSeattleRentals: async (req, res) => {
        res.json(await VehicleRental.find({ cityAddress: 'Seattle, WA' }));
    },

    // READ ALL Seattle rentals 
    allNewYorkRentals: async (req, res) => {
        res.json(await VehicleRental.find({ cityAddress: 'New York, NY' }));
    },

    // READ ALL user-vehicleRentals
    userVehicleRentals: async (req, res) => {
        const { token } = req.cookies;
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            const { id } = userData;
            res.json(await VehicleRental.find({ owner: id }))
        });
    },

    // READ ONE user vehicle rental
    oneUserVehicleRental: async (req, res) => {
        const { id } = req.params;
        res.json(await VehicleRental.findById(id));
    },

    // UPDATE user vehicle rental
    updateUserVehicleRental: async (req, res) => {
        const { token } = req.cookies;
        const {
            id,
            year,
            make,
            model,
            addedPhotos,
            experience,
            avgMPG,
            doors,
            fuelType,
            seats,
            description,
            features,
            streetAddress,
            cityAddress,
            mapLocation,
            mapImage,
            pricePerDay
        } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const vehicleRentalDoc = await VehicleRental.findById(id);

            if (userData.id === vehicleRentalDoc.owner.toString()) {
                vehicleRentalDoc.set({
                    year,
                    make,
                    model,
                    photos: addedPhotos,
                    experience,
                    avgMPG,
                    doors,
                    fuelType,
                    seats,
                    description,
                    features,
                    streetAddress,
                    cityAddress,
                    mapLocation,
                    mapImage,
                    pricePerDay
                })
                await vehicleRentalDoc.save();
                res.json('ok');
            }
        });
    },

    // CREATE Vehicle Rental Booking
    createBooking: async (req, res) => {
        const userData = await getUserDataFromReq(req);
        const {
            token,
            vehicleRental,
            checkIn,
            checkOut,
            name,
            email,
            phoneNumber,
            totalHours,
            totalPrice,
            transactionId
        } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.charges.create({
            amount: totalPrice * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        })

        if (payment) {
            await Booking.create({
                vehicleRental,
                checkIn,
                checkOut,
                name,
                email,
                phoneNumber,
                totalHours,
                totalPrice,
                transactionId: req.body.transactionId = payment.source.id,
                user: userData.id
            })
                .then((doc) => {
                    res.json(doc);
                })
                .catch((err) => {
                    throw err;
                })
        }
        else {
            return res.status(400).json(error);
        }
    },

    // READ ALL User Vehicle Rental Bookings
    allUserBookings: async (req, res) => {
        const userData = await getUserDataFromReq(req);
        res.json(await Booking.find({ user: userData.id }).populate('vehicleRental'))
    },

    // DELETE User Vehicle Rental Booking
    deleteBooking: async (req, res) => {
        await Booking.findByIdAndDelete(req.params.id)
            .then(result => res.json(result))
            .catch(err => res.json({
                error: err,
                message: 'error res'
            }))
    }

}
