//-------------------------- IMPORTS NEEDED ----------------------------
// IMPORT Express - call it express b/c official documentation says so 
// >>> require express from node_modules
const express = require('express');

// IMPORT cors >>> coming from require cors
const cors = require('cors');

// Instantiate express by storing in a variable app
const app = express();

// Establish PORT number >>> global variable by convention should be all caps (PORT)
const PORT = process.env.PORT || 5000;

// Declaring DB that'll be used for app
const DB = 'cncauto';

// IMPORT cookie-parser
const cookieParser = require('cookie-parser');

// IMPORT image-downloader
const imageDownloader = require('image-downloader');

// IMPORT multer
const multer = require('multer');

// IMPORT fs - file system library
const fs = require('fs');

// IMPORT path
const path = require('path');




//--------------------------- MIDDLEWARE --------------------------------
app.use(express.json(), express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    credentials: true,
    // Localhost 
    origin: 'http://localhost:5173'
    // origin: '*'
    // AWS EC2
    // origin: 'http://52.10.71.141/'
    // Linode
    // origin: 'http://172.232.170.81/'
}));




//---------------------------- FULL SERVER CRUD STEPS -------------------------
// 1. Connect mongodb by requiring the file here
// 2. Create mongoose schema
// 3. Use mongoose model to make CRUD functions -> talk to controller
// 4. Create routes to execute the functions to the db


// 1. ------------- DATABASE CONNECTION >>> Pass DB through exported mongoose connect function --------------
require('./config/mongoose.config')(DB);



// 4. ROUTING CONNECTION
require('./routes/user.routes')(app);
require('./routes/vehicleRental.routes')(app);
require('./routes/vehicleForSale.routes')(app);
require('./routes/booking.routes')(app);




// ----------------------------- Download/Upload Image Endpoint Routes -----------------------------

// Testing Endpoint
app.get('/test', (req, res) => {
    res.json('root route test ok');
});


// ADD place images by link
app.post('/upload-by-link', async (req, res) => {

    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';

    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});


// Multer upload funcionality
const photosMiddleware = multer({ dest: 'uploads' });


// UPLOAD added place images
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
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
});



// ------------------- App listen function (param1 = PORT, param2 = callback function) ----------------------
// Console log to see server is running and listening for requests

app.listen(PORT, () => console.log(`***** Server up on PORT: ${PORT} *****`));