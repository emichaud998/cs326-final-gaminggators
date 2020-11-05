'use strict';
// initialize library constants
const crypto = require('crypto');
const faker = require('faker'); // temporary to generate fake data
const express = require('express');
const app = express();

// initialize helper functions
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
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

// User login to an acocunt
// @param email, password
// @return 200 authorized or 401 unauthorized status code
app.post('/login', (req, res) => {
    // curl -X POST -d '{ "email" : "tshee@umass.edu", "password" : "secretSecret3" }' -H "Content-Type: application/json" http://localhost:3000/signin
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    const user = datastore.users.find(u => {
        return u.email === email && hashedPassword === u.password
    });
    if (user) {
        // const authToken = generateAuthToken();
        res.status(200).send({ message: "Registered. Check your email for verification." });
    } else {
        res.status(401).send({ error: "Invalid username or password" });
    }
});
// Create new user (registration)
// @param email, username, password, confirmPassword
// @return 200 approved OR 400 bad request OR 409 Conflict 
app.post('/user/register', (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
        if (users.find(user => user.email === email)) {
            res.status(409).send({ error: "Bad Request - User email already in use." });
        }
        else if (users.find(user => user.username === username)) {
            res.status(409).send({ error: "Bad Request - User username already in use." });
        }
        const hashedPassword = getHashedPassword(password);
        datastore.users.push({
            firstName,
            lastName,
            email,
            friendList: [],
            messageList: [],
            password: hashedPassword
        });
        res.status(200).send({ message: "Registered. Check your email for verification." });
    } else {
        res.status(400).send({ error: "Bad Request - Passwords don't match." });
    }
});
// Creates new friend in user friend list (registration)
// @param email, username, password, confirmPassword
// @return 200 approved or 400 bad request status code
app.post('/user/newFriend', (req, res) => {
    const { username, friendUsername } = req.body;
    // check both users actually exist in database
    const user = datastore.users.find(u => {
        return u.email === email && username === u.username
    });
    const friendUser = datastore.users.find(u => {
        return u.email === email && username === u.username
    });
    if (user && friendUser) {
        // check friendUsername is NOT in friend's list
        if (user.friendList.includes(friendUsername)) {
            res.status(401).send({ error: "Username already in friend list" });
            return;
        }
        // since no index is kept, must query again to change user
        datastore.users.find(u => {
            if (u.email === email && username === u.username) {
                u.friendList.push(friendUsername)
            }
        });
        res.status(200).send({ message: "New friend added to friend list" });
    } else {
        res.status(401).send({ error: "Friend username not found in list of usernames" });
    }
});
// Gets list of friends of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/friends', (req, res) => {
    const { username } = req.body;
    const user = datastore.users.find(u => {
        return username === u.username
    });
    if (user) {
        const friendList = user.friendList
        res.status(200).json(friendList)
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});
// Gets profile of given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/username', (req, res) => {
    const { username } = req.body;
    const user = datastore.users.find(u => {
        return username === u.username
    });
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});
/*
    TODO: CHANGE messageList structure for scale
    https://stackoverflow.com/questions/4785065/table-structure-for-personal-messages
*/
// Gets message list of given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/messages', (req, res) => {
    const { username } = req.body;
    const user = datastore.users.find(u => {
        return username === u.username
    });
    if (user) {
        const messageList = user.messageList
        res.status(200).json(messageList)
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});
// game-related API endpoints
app.post('/gameGenre', (req, res) => {
    const { genre } = req.body;
    const gameList = datastore.games.filter(g => {
        return genre === g.genre
    });
    if (!(gameList === undefined || gameList.length == 0)) {
        res.status(200).json(gameList)
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});
app.post('/gamePlatform', (req, res) => {
    const { platform } = req.body;
    const gameList = datastore.games.filter(g => {
        return platform === g.platform
    });
    if (!(gameList === undefined || gameList.length == 0)) {
        res.status(200).json(gameList)
    } else {
        res.status(400).send({ error: "Username not found" });
    }
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
