require('dotenv').config({ path: './.env' });

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};

// app.use(bodyParser.urlencoded({ extended: true })); //x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); //applications/json

//registering multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

//serving static files
app.use('/images', express.static(path.join(__dirname, 'images')));

//CORS - CROSS ORIGIN RESOURCES SHARING
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
  `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPW}@cluster0.ajqaw.mongodb.net/messages?retryWrites=true&w=majority`
  )
  .then(result => {
    app.listen(8080, () => {
      console.log('listening on http://localhost:8080');
    })
  })
  .catch(err => console.log(err));
