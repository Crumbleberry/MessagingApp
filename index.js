// Setting up the app
const express = require('express');
const app = express();
app.set('view engine','ejs');

//Setting up the body parser
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true})); 

// Setting up the Database using DynamoDB
const AWS = require('aws-sdk');

// Setting up the AWS Config
const awsConfig = {
    'region': 'us-east-2',
    'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
    'accessKeyId': 'AKIATAGDZM7M4XE32Q7U', 'secretAccessKey': '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'
}

AWS.config.update(awsConfig);


//Connecting to the DB
const docClient = new AWS.DynamoDB.DocumentClient();

//testing
let testingFunction = function() {

    var newItem = {
        'UserID': 1,
        'UserName': 'Tyler'
    };

    var params = {
        TableName: 'MessagingAppUsers',
        Item: newItem
    };

    docClient.put(params, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Saved!');
        }
    })

};

//testingFunction();

// Bringing in User and Message Schema

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


})

app.post('/createaccount', async (req, res) => {
    var maxID = 0;
    
    console.log('Pulling Users for ID');

    var params = {
        TableName: 'MessagingAppUsers'
    };

    docClient.scan(params, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
            data.Items.forEach(element => {
                console.log(element);
                if(element.UserID > maxID) {
                    maxID = element.UserID;
                }
            });
        }
    })

    console.log(`Max ID: ${maxID}, Creating new user`);

    var newUser = {
        'UserID': maxID + 1,
        'UserName': req.body.userName,
        'UserPassword': req.body.password,
    }

    var newUserParams = {
        TableName: 'MessagingAppUsers',
        Item: newUser
    }

    console.log('Saving new User to DB');
    console.log(newUser);

    docClient.put(newUserParams, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`New User: ${newUser.UserName} Saved`);
        }
    })

    res.redirect('landing');
})

console.log('Running');
app.listen(3000);