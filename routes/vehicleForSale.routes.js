// Import Vehicle_Rental Controller
const VehicleForSale = require('../controllers/vehicleForSale.controller');

module.exports = (app) => {

    // Test Route
    app.get('/api/vehicles/forSale/hello', (req, res) => {
        res.json({ message: "hello from vehicles for sale routes" })
    })

    // Vehicle For Sale Routes
    // // app.post('/upload-by-link', Place.imageDownloader);
    // // app.post('/upload', (photosMiddleware.array('photos', 100)), Place.imageUpload);
    app.post('/vehiclesForSale', VehicleForSale.createVehicleForSale);
    app.get('/vehiclesForSale', VehicleForSale.allVehiclesForSale);
    app.get('/user-vehiclesForSale', VehicleForSale.userVehiclesForSale);
    app.get('/vehiclesForSale/:id', VehicleForSale.oneUserVehicleForSale);
    app.put('/vehiclesForSale', VehicleForSale.updateUserVehicleForSale);

}