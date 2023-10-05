// Execute CRUD functions from here >>> will be executed based on routes

// IMPORT MODEL >>> controller to use when performing CRUD functions
const User = require('../models/user');

// IMPORT jsonwebtoken
const jwt = require('jsonwebtoken');

// IMPORT Bcryptjs for password protection
const bcrypt = require('bcryptjs');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'naln4wlsknos5clasm8flw2sel';


// ------------------------- CRUD Functions ------------------------ 
// >>> export functions with module.exports to send as object
// Keys will be name of function : Values will be function itself

module.exports = {

    // REIGISTER New User
    registerUser : async (req, res) => {
        console.log(req.body);

        const { firstName, lastName, email, password } = req.body;

        await User.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
            .then(newUser => res.json({
                newUser,
                message: 'successfully created account'
            }))
            .catch(err => {
                console.log('SERVER ERR -> Write to DB / CREATE');

                // Platform
                //res.status(400).json(err)

                // Convention 
                res.status(400).json({
                    error: err,
                    message: 'error res'
                })
            })
    },

    // LOGIN User
    loginUser : async (req, res) => {

        const { email, password } = req.body;

        const currentUser = await User.findOne({email});
        if (currentUser) {
            // res.json('User found');
            const passOk = bcrypt.compareSync(password, currentUser.password)
            if (passOk) {
                jwt.sign( {
                    email: currentUser.email, 
                    id: currentUser._id
                }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(currentUser);
                });
            } else {
                res.status(422).json('pass Not Ok');
            }
        } else {
            res.json('User not found');
        }
    },

    // VERIFY User - get user profile data
    verifyUser : async (req, res) => {

        const { token } = req.cookies;

        if (token) {
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) throw err;
    
                const { firstName, lastName, email, isAdmin, _id } = await User.findById(userData.id);
                res.json({ firstName, lastName, email, isAdmin, _id });
            })
        } else {
            res.json(null);
        }
    },

    // LOGOUT User
    logoutUser : (req, res) => {
        res.cookie('token', '').json(true);
    }

}