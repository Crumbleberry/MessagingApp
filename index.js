// Setting up the app
const express = require('express');
const app = express();
app.set('view engine','ejs');

// Setting up the Database using MongoDB
const mongoose = require('mongoose');

// Setting up the Database URL
const dbURL = 'mongodb+srv://user1:UUTo7oqGN58dZqE3@timeclock.oaikt.mongodb.net/TimeClock?retryWrites=true&w=majority';

//Connecting to the DB
mongoose.connect(dbURL)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

// Bringing in User and Message Schema
const Message = require('./Models/Messages');
const User = require('./Models/Users');


// GET Routes
app.get('/', (req, res) => {
    res.render('LoginPage');
})

// POST Routes
app.post('/login', (req,res) => {
    res.send('Success');
})


app.listen(3000);