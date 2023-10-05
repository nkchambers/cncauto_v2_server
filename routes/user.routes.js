// Import User Controller
const User = require('../controllers/user.controller');


module.exports = (app) => {

    // Test Route
    app.get('/api/user/hello', (req, res) => {
        res.json({message: "hello from user routes"})
    })

    // Auth Routes
    app.post('/register', User.registerUser);
    app.post('/login', User.loginUser);
    app.get('/profile', User.verifyUser);
    app.post('/logout', User.logoutUser);

}