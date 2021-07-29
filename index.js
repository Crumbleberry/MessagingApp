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

app.get('/createaccount', (req, res) => {
    res.render('createaccount');
})

app.get('/:id/landing', (req, res) => {
    res.render('landing');
})

// POST Routes
app.post('/login', (req,res) => {
    var enteredUsername = '';

    User.find({userName: req.params.userName})
    .then((result) => {
        if(result) {
            res.redirect(`/${result.userID}/landing`);
        } else {
            res.send('Invalid Username or Password');
        }
    })
})

app.post('/createaccount', async (req, res) => {
    var maxID = 0;

    await User.find({userName: req.params.userName})
    .then(async (result) => {
        if(result) {
            res.send('This username is already in user');
        } else {
            await User.find()
            .then((laterResult) => {
                laterResult.foreach((user) => {
                    if(user.userID > maxID) {
                        maxID = user.userID;
                    }
                })
            })

            const newUser = new User({
                userName: req.params.userName,
                userPassword: req.params.userPassword,
                userID: maxID + 1
            })

            User.save()
            .then((result) => {
                res.redirect(`/${result.userID}/landing`);
            })
        }
    })
})

app.listen(3000);