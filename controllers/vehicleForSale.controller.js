// IMPORT MODEL >>> controller to use when performing CRUD functions
const VehicleForSale = require('../models/vehicleForSale');

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


// GRAB USER DATA FUNCTION
function getUserDataFromReq(req) {
    return new Promise ((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            resolve(userData);
        });
    });
}


// ------------------------- CRUD Functions ------------------------ 
// >>> export functions with module.exports to send as object
// Keys will be name of function : Values will be function itself


module.exports = {

    // CREATE new vehicleForSale
    createVehicleForSale : async (req, res) => {

        const { token } = req.cookies;
        const {
            year,
            make,
            model,
            addedPhotos,
            mileage,
            avgMPG,
            doors,
            fuelType,
            seats,
            description,
            features,
            cityAddress,
            mapLocation,
            mapImage,
            salePrice
        } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;

            const vehicleForSaleDoc = await VehicleForSale.create({
                owner: userData.id,
                year,
                make,
                model,
                addedPhotos,
                mileage,
                avgMPG,
                doors,
                fuelType,
                seats,
                description,
                features,
                cityAddress,
                mapLocation,
                mapImage,
                salePrice
            });

            res.json(vehicleForSaleDoc);
        });
    },

    // ADD vehicleForSale images by link
    imageDownloader : async (req, res) => {

        const { link } = req.body;
        const newName = 'photo' + Date.now() + '.jpg';

        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        res.json(newName);
    },

    // UPLOAD added vehicleForSale images
    imageUpload : (req, res) => {
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

    // READ ALL vehiclesForSale
    allVehiclesForSale : async (req, res) => {
        res.json(await VehicleForSale.find());
    },

    // READ ALL user-vehiclesForSale
    userVehiclesForSale : async (req, res) => {
        const { token } = req.cookies;
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            const { id } = userData;
            res.json(await VehicleForSale.find({ owner: id }))
        });
    },

    // READ ONE user vehicleForSale
    oneUserVehicleForSale : async (req, res) => {
        const { id } = req.params;
        res.json(await VehicleForSale.findById(id));
    },

    // UPDATE user vehicleForSale
    updateUserVehicleForSale : async (req, res) => {
        const { token } = req.cookies;
        const {
            id,
            year,
            make,
            model,
            addedPhotos,
            mileage,
            avgMPG,
            doors,
            fuelType,
            seats,
            description,
            features,
            cityAddress,
            mapLocation,
            mapImage,
            salePrice
        } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const vehicleForSaleDoc = await VehicleForSale.findById(id);

            if (userData.id === vehicleForSaleDoc.owner.toString()) {
                vehicleForSaleDoc.set({
                    year,
                    make,
                    model,
                    photos: addedPhotos,
                    mileage,
                    avgMPG,
                    doors,
                    fuelType,
                    seats,
                    description,
                    features,
                    cityAddress,
                    mapLocation,
                    mapImage,
                    salePrice
                })
                await vehicleForSaleDoc.save();
                res.json('ok');
            }
        });
    }
}