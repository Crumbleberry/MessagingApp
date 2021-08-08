// Setting up the app
const express = require('express');
const app = express();
app.set('view engine','ejs');

// Setting up Enviornment Variables
require('dotenv').config();

//Setting up the body parser
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true})); 

// Setting up the Database using DynamoDB
const AWS = require('aws-sdk');
const { promiseImpl } = require('ejs');

// Setting up the AWS Config
const awsConfig = {
    'region': 'us-east-2',
    'endpoint': 'http://dynamodb.us-east-2.amazonaws.com',
    'accessKeyId': process.env.AWS_ACCESS_KEY_ID, 'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY
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

app.get('/:id/landing', async (req, res) => {
    
    const messagesParams = {
        TableName: 'MessagingAppMessages',
        FilterExpression: '#FR = :f',
        ExpressionAttributeNames: {
            '#FR': 'fromUser',
        },
        ExpressionAttributeValues: {
            ':f': req.params.id,
        }
    };


    await new Promise((resolve, reject) => {
        docClient.scan(messagesParams, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                console.log(data);
                if(data.Count > 0) {
                    var messagesToShow = true;
                }
                res.render('landing',{messagesToShow: messagesToShow, messages: data, userID: req.params.id});
            }
            resolve();
        })
    })

    
})

app.get('/login', (req, res) => {
    res.render('LoginPage');
})

// POST Routes
app.post('/login', async (req,res) => {
    var enteredUsername = req.body.userName;
    var enteredPassword = req.body.password;

    var correctLogin = false;

    var params = {
        TableName: 'MessagingAppUsers'
    };

    await new Promise((resolve, reject) => {
        docClient.scan(params, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                data.Items.forEach(element => {
                    if(element.UserName == enteredUsername && element.UserPassword == enteredPassword) {
                        correctLogin = true;
                        res.redirect(`/${element.UserID}/landing`);
                    }
                }); 
            }
            if(!correctLogin) {
                res.send('Invalid Username and/or Password');
            }
            resolve();
        })
    });
})

app.post('/createaccount', async (req, res) => {
    var maxID = 0;
    
    console.log('Pulling Users for ID');

    var params = {
        TableName: 'MessagingAppUsers'
    };

    await new Promise((resolve, reject) => {
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
            resolve();
        })
    });
    

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

    await new Promise((resolve, reject) => {
        docClient.put(newUserParams, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                console.log(`New User: ${newUser.UserName} Saved`);
            }
            resolve();
        })
    }); 

    res.redirect(`/${newUser.UserID}/landing`);
})

app.post('/sendMessage/:id', async (req, res) => {

    var maxID = 0;

    var allMessagesParams = {
        TableName: 'MessagingAppMessages'
    };

    await new Promise((resolve, reject) => {
        docClient.scan(allMessagesParams, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                data.Items.forEach(element => {
                    if(element.MessageID > maxID) {
                        maxID = element.MessageID;
                    }
                }); 
            }
            resolve();
        })
    });

    var newItem = {
        'MessageID': maxID + 1,
        'fromUser': req.params.id,
        'toUser': req.body.toUser,
        'messageText': req.body.messageText,
        'timeStamp': Date.now()
    };

    var params = {
        TableName: 'MessagingAppMessages',
        Item: newItem
    };

    await new Promise((resolve, reject) => {
        docClient.put(params, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                console.log('Saved!');
            }
            resolve();
        })
    })

    res.redirect(`/${newItem.fromUser}/landing`);
})

console.log('Running');
app.listen(3000);