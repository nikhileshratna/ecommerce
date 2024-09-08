const express = require("express");
const user = express();

const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

user.use(bodyParser.urlencoded({ extended:true }));
user.use(express.static(path.resolve(__dirname,'public')));

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb) =>{
        cb(null,file.originalname)
    }
});

var upload = multer({ storage:storage });

const userController = require('../controllers/userController');

user.get('/users',userController.users);
user.post('/import-user',upload.single('file'),userController.importUser);

user.get('/export-user',userController.exportUser);

module.exports = user;