const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./util/database');

const plantRoutes = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(plantRoutes);
app.use(appRoutes);

mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});
