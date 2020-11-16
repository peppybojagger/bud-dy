const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/user');
const plantData = require('./routes/plant');
const appRoutes = require('./routes/app');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use(plantData.routes);
app.use(appRoutes);

const server = http.createServer(app);

server.listen(3000);