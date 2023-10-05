// Import Vehicle Controller
const VehicleRental = require('../controllers/vehicleRental.controller');

module.exports = (app) => {

    // Test Route
    app.get('/api/bookings/hello', (req, res) => {
        res.json({ message: "hello from booking routes" })
    })

    // Booking Routes
    app.post('/bookings', VehicleRental.createBooking);
    app.get('/bookings', VehicleRental.allUserBookings);
    app.delete('/bookings/delete/:id', VehicleRental.deleteBooking);
}