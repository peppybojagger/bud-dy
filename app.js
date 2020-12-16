const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// const User = require('./models/user');

const plantRoutes = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findUserbyId('5fd950b4b01a143bfe43f874')
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch(err => {
//         console.log(err);
//     })
// });

app.use(plantRoutes);
app.use(appRoutes);

mongoose.connect('mongodb+srv://peppybojagger:ApolloMargot420@cluster0.d1sck.mongodb.net/Bud-dy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
