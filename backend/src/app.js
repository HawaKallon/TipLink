const express = require('express');
const bodyParser = require('body-parser');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', walletRoutes);

module.exports = app;
