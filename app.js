const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');

const plantRoutes = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

const MONGODB_URI = 'mongodb+srv://peppybojagger:ApolloMargot420@cluster0.d1sck.mongodb.net/Bud-dy?retryWrites=true&w=majority';
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

app.use(plantRoutes);
app.use(appRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
