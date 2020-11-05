'use strict';
// initialize library constants
const crypto = require('crypto');
const express = require('express');
const app = express();

// initialize helper functions
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const port = 3000;
app.use(express.json()); // lets you handle JSON input

let datastore = {
    users: [],
    games: []
};

// Load API Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!')
});
//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x
app.get('/create', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/read', (req, res) => {
    const k = req.query.key;
    const v = datastore[k];
    res.send(`key = ${k}, value = ${v}`);
});
app.get('/read/:key', (req, res) => {
    const k = req.params['key'];
    const v = datastore[k];
    res.send(`key = ${k}, value = ${v}`);
});
//   curl -d '{ "key" : "x", "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/pcreate
app.post('/pcreate', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    datastore[k] = v;
    console.log(`Set ${k} to ${v}, body = ${JSON.stringify(req.body)}`);
    res.send('Set.');
});
app.get('*', (req, res) => {
    res.send('NO FOOL');
});

// curl -X POST -d '{ "email" : "tshee@umass.edu", "password" : "secretSecret3" }' -H "Content-Type: application/json" http://localhost:3000/signin
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });
    if (user) {
        // const authToken = generateAuthToken();
        res.status(200).send({ message: "Registered. Check your email for verification." });
    } else {
        res.status(401).send({ error: "Invalid username or password" });
    }
});
// Create new user
app.post('/user/register', (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
        if (users.find(user => user.email === email)) {
            res.status(400).send({ error: "Bad Request - User email already in use." });
        }
        else if (users.find(user => user.username === username)) {
            res.status(400).send({ error: "Bad Request - User username already in use." });
        }
        const hashedPassword = getHashedPassword(password);
        datastore.users.push({
            firstName,
            lastName,
            email,
            friendList: [],
            password: hashedPassword
        });
        res.status(200).send({ message: "Registered. Check your email for verification." });
    } else {
        res.status(400).send({ error: "Bad Request - Passwords don't match." });
    }
});
app.post('/user/newFriend', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const signin = true;
    if (signin) {
        res.status(200).send({ message: "Registered. Check your email for verification." });
    }
    else { 
        res.status(401).send({ error: "Registration failed." });
    }
});
app.post('/user/friends', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const friendList = [];
    res.status(200).json(friendList);
});
app.post('/user/username', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const profile = {};
    res.status(200).json(profile);
});
app.post('/user/messages', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const messageList = [];
    res.status(200).json(messageList);
});
// game-related API endpoints
app.post('/gameGenre', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gamePlatform', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameFranchise', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameCompany', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameRatings', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameReleaseDate', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameName', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/gameSort', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});
app.post('/rateGame', (req, res) => {
    const reqBody = req.body; // JavaScript object containing the parse JSON
    const userInfo = {
        username: reqBody.username
    }
    const listOfFriends = [];
    res.status(200).json(listOfFriends);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
