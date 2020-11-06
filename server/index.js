'use strict';
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json()); // lets you handle JSON input
const port = 8080;

app.use('/', express.static('client/src/html'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});