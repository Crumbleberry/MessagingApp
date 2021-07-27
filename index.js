// Setting up the app
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('Working');
    res.send('Working');
})

app.listen(3000);