const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const multer  = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const plantRoutes = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.d1sck.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//       cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// });
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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadS3 = multer({
    fileFilter: fileFilter,
    storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: 'buddy-user-images',
      metadata: (req, file, cb) => {
        cb(null, {fieldName: file.fieldname})
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname)
      }
    })
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    uploadS3.single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "'unsafe-inline'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'],
        styleSrc: ["'self'", "'unsafe-inline'",  'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'],
        imgSrc: ["*", 'data:'],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    }
  })
);
app.use(compression());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        throw new Error(err);
    })
});

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(plantRoutes);
app.use(appRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(result => {
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
}).catch(err => {
    console.log(err);
});
