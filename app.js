const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;

const plantRoutes = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

app.use(plantRoutes);
app.use(appRoutes);

mongoConnect(() => {
    app.listen(3000);
});
