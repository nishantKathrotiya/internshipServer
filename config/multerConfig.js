const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const userId = String(req.user._id); 
        const userDirectory = path.join(__dirname, '../Files', userId);
        if (!fs.existsSync(userDirectory)) {
          fs.mkdirSync(userDirectory, { recursive: true });
        }
        cb(null, userDirectory);
      },
      filename: (req, file, cb) => {
        cb(null,  Date.now()  + '-' + file.fieldname+`.${file.mimetype.split('/')[1]}`);
      }
});

const upload = multer({ storage });

module.exports = {upload};


