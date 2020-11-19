'use strict';

// For loading environment variables.
require('dotenv').config();

const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const query = require('./dbQueries.js');

// initialize library constants
const faker = require('faker'); // temporary to generate fake data

const minicrypt = require('./miniCrypt');
const mc = new minicrypt();

 // initialize custom constants
 const port = process.env.PORT || 8080;

 query.databaseConnectionSetup();

 const datastore = {
     users: [],
     games: []
 };

const genre_list = [
    'Point-and-click','Fighting','Shooter',
    'Music','Platform','Puzzle',
    'Racing','Real Time Strategy (RTS)','Role-playing (RPG)',
    'Simulator','Sport','Strategy','Turn-based-strategy(TBS)', 
    'Tactical', 'Quiz/Trivia', 'Hack and slash/Beat \'em up', 'Pinball', 
    'Adventure', 'Arcade', 'Visual Novel', 'Indie', 
    'Card & Board Game', 'MOBA' 
];

const platform_list = [];

const franchise_list = [];

const company_list = [];

const release_years_list = [];

const game_title_list = [];

function randomArrayElements(min, max, fakerFunc, all_list) {
    const index = faker.random.number({
        'min': min,
        'max': max
    });
    
    const array = [];
    for (let i = 0; i < index; i++) {
        const element = fakerFunc();
        if (!array.includes(element)){
            array.push(element);
            if (all_list !== null) {
                if (!all_list.includes(element)) {
                    all_list.push(element);
                }
            }
        } else {
            i--;
        }
    }

    return array;
}

function setup() {
    // Populate users && games

    const userID_1 = '1111';
    const userID_2 = '2222';
    const userID_3 = '3333'; 
    const userID_4 = '4444';

    const username_1 = 'Jill_Valentine';
    const username_2 = 'Chris_Redfield';
    const username_3 = 'Claire_Redfield';
    const username_4 = 'Leon_Kennedy';

    const password_1 = 'hunter1';
    const password_2 = 'hunter2';
    const password_3 = 'hunter3';
    const password_4 = 'hunter4';

    const email_1 = 'jvalentine@raccoon.com';
    const email_2 = 'chrisredfield@raccoon.com';
    const email_3 = 'claireredfield@raccoon.com';
    const email_4 = 'lkennedy@raccoon.com';

    const profile_pic_1 = faker.image.avatar();
    const profile_pic_2 = faker.image.avatar();
    const profile_pic_3 = faker.image.avatar();
    const profile_pic_4 = faker.image.avatar();

    const friendList_1 = ['2222'];          //Jill is friends with Chris
    const friendList_2 = ['1111', '3333'];  //Chris is friends with Jill and Claire
    const friendList_3 = ['2222'];          //Claire is friends with Chris
    const friendList_4 = [];                //Leon is friends with noone :( poor Leon

    const messageList_1 = [{id : '0001', sender : 'Chris_Redfield', title: 'Hi Jill!', message : 'Hi Jill! You should check out Amnesia!'}];
    const messageList_2 = [{id : '0002', sender : 'Jill_Valentine', title: 'Hi Chris!', message : 'Hi Chris! You should check out Outlast!'}, {id : '0003', sender : 'Claire_Redfield', title: 'Hi Chris!', message : 'Hi Chris! You should check out Layers of Fear!'}];
    const messageList_3 = []; //No Messages
    const messageList_4 = []; //No Messages

    datastore.users.push(
        {
            id: userID_1,                   //string
            username: username_1,           //string
            email: email_1,                 //string
            password: password_1,           //string
            profilePicture: profile_pic_1,  //url
            friendList: friendList_1,       //array of IDs(strings)
            messageList: messageList_1,     //array of obj = {messageID(string) , senderUsername(string), message(string)}
            ratings: [],                    //array of obj = {gameID(string) , rating(int)}
            wishlist: [],                   //array of obj = {gameID(string)}
            recommendations: []             //array of --INSERT RECOMMENDATIONS TYPE--
        },
        {
            id: userID_2,                   //string
            username: username_2,           //string
            email: email_2,                 //string
            password: password_2,           //string
            profilePicture: profile_pic_2,  //url
            friendList: friendList_2,       //array of IDs(strings)
            messageList: messageList_2,     //array of obj = {messageID(string) , senderUsername(string), message(string)}
            ratings: [],                    //array of obj = {gameID(string) , rating(int)}
            wishlist: [],                   //array of obj = {gameID(string)}
            recommendations: []             //array of --INSERT RECOMMENDATIONS TYPE--
        },
        {
            id: userID_3,                   //string
            username: username_3,           //string
            email: email_3,                 //string
            password: password_3,           //string
            profilePicture: profile_pic_3,  //url
            friendList: friendList_3,       //array of IDs(strings)
            messageList: messageList_3,     //array of obj = {messageID(string) , senderUsername(string), message(string)}
            ratings: [],                    //array of obj = {gameID(string) , rating(int)}
            wishlist: [],                   //array of obj = {gameID(string)}
            recommendations: []             //array of --INSERT RECOMMENDATIONS TYPE--
        },
        {
            id: userID_4,                   //string
            username: username_4,           //string
            email: email_4,                 //string
            password: password_4,           //string
            profilePicture: profile_pic_4,  //url
            friendList: friendList_4,       //array of IDs(strings)
            messageList: messageList_4,     //array of obj = {messageID(string) , senderUsername(string), message(string)}
            ratings: [],                    //array of obj = {gameID(string) , rating(int)}
            wishlist: [],                   //array of obj = {gameID(string)}
            recommendations: []             //array of --INSERT RECOMMENDATIONS TYPE--
        }
    );

    for (let i = 0; i < 30; i++) {
        const id = faker.random.number().toString();
        const cover = faker.image.image();
        const name = faker.commerce.productName();
        if (!game_title_list.includes(name)) {
            game_title_list.push({'title': name, 'gameID': id});
        }
        const genre = randomArrayElements(1, 4, () => {
            const random = faker.random.number({'min': 0,'max': 22}); 
            return genre_list[random];
        }, null);
        const platform = randomArrayElements(1, 3, faker.commerce.product, platform_list);
        const developers = randomArrayElements(1, 3, faker.company.companyName, company_list);
        const publishers = randomArrayElements(1, 2, faker.company.companyName, company_list);
        const franchise = randomArrayElements(1, 3, faker.commerce.department, franchise_list);
        const releaseDate = faker.date.between('1953-01-01', '2021-12-30');
        if (!release_years_list.includes(releaseDate.getFullYear())) {
            release_years_list.push(releaseDate.getFullYear());
        }
        const ratingAverage = faker.random.number({'min': 1,'max': 5});
        const gameModes = randomArrayElements(1, 4, faker.commerce.productAdjective, null);
        const keywords = randomArrayElements(1, 10, faker.random.word, null);
        const screenshots = randomArrayElements(1, 5, faker.image.image, null);
        const description = faker.lorem.paragraph(5);
        datastore.games.push({
            id: id,
            cover: cover,
            name: name,
            genre: genre,
            platform: platform,
            franchise: franchise,
            developers: developers,
            publishers: publishers,
            releaseDate: releaseDate,
            ratingAverage: ratingAverage,
            gamemodes: gameModes,
            keywords: keywords,
            screenshots: screenshots,
            description: description
        });
    }

    release_years_list.sort((a, b) => {return a - b;});
}

// Session configuration

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    async (username, password, done) => {
    const user = await findUser(username);
	if (!user) {
        // no such user
        return done(null, false, { 'message' : 'Wrong username' });
    }
    const passwordCheck = await validatePassword(username, password);
	if (!passwordCheck) {
        // invalid password
        // should disable logins after N messages
        // delay return to rate-limit brute-force attacks
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { 'message' : 'Wrong password' });
	}
	// success!
	// should create a user object here, associated with a unique identifier
	return done(null, user);
    });


// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data
app.use('/private', checkLoggedIn, express.static('client/src/private'));
app.use('/', checkLanding, express.static('client/src'));
app.use(express.static('client/src'));

///// 
// Returns the user object iff the user exists otherwise false.
async function findUser(username) {

    const user = await query.execOneOrNone('*', 'users', 'username = $1', [username]);

    if(user !== null)
    {
        return user;
    }
    return false;
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
async function validatePassword(name, pwd) {

    const response = await query.execOne('salt, password', 'users', 'username = $1', [name]);

    const passwordCheck = mc.check(pwd, response.salt, response.password);

    return passwordCheck;
}

// Add a user to the database.
// Return true if added, false otherwise (because it was already there).
async function addUser(username, password, email) {
    // TODO
    const user = await findUser(username);
	if (!user) {
		const [salt, hash] = mc.hash(password);
        await query.insertIntoUsers(username, email, hash, salt);

		return true;
	}
	return false;
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
	// If we are authenticated, run the next route.
	next();
    } else {
	// Otherwise, redirect to the login page.
	res.redirect('/');
    }
}

function checkLanding(req, res, next) {
    if (req.isAuthenticated() && req.url === '/') {
        res.redirect('/private/dashboard.html');
    } else {
        next();
    }
}

// Routes 

// Handle post data from the login.html form.
app.post('/user/login',
    passport.authenticate('local' , {     // use username/password authentication
        'successRedirect' : '/private/dashboard.html',   // when we login, go to /private 
        'failureRedirect' : '/signin.html'      // otherwise, back to login
    }));

// Handle logging out (takes us back to the login page).
app.get('/user/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/signin.html'); // back to login
});

// Add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
// TODO
app.post('/user/register',
    async(req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        const email = req.body['email'];
        if (email !== undefined && username !== undefined && password !== undefined) {

            const response = await query.findMatchingEmail(email);

            if (response !== null) {
                res.status(409).send({ error: "Bad Request - User email already in use." });
                return;
            }
            // Check if we successfully added the user.
            // If so, redirect to '/login'
            // If not, redirect to '/register'.
            if (await addUser(username, password, email)) {
                res.status(200).send({ message: "Registered successfully!" });
                return;
            } else {
                res.status(409).send({ error: "Bad Request - User username already in use." });
                return;
            }
        }
    }
);

// Updates user username
// @param oldUsername, newUsername
// @return 200 exists or 400 bad request status code
app.post('/user/username/update', async(req, res) => {
    const newUsername = req.body['newUsername'];
    if (req.user !== undefined) {
        if (newUsername !== undefined)
        {
            const usernameAvailCheck = await query.execOneOrNone('username', 'users', 'username = $1', [newUsername]);

            //Check is username is available or not
            if (usernameAvailCheck !== null)
            {
                res.status(401).send({ error: "New username already in use." });
                return;
            } 
            else
            {
                await query.updateAt('users', 'username = $1', 'id = $2', [newUsername, req.user.id]);

                res.status(200).json({ message: "Successfully updated username" });
                return;
            }
        }
        else 
        {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Updates user password
// @param username, newPassword
// @return 200 exists or 400 bad request status code
app.post('/user/password/update', async(req, res) => {
    const newPassword = req.body['newPassword'];
    if (req.user !== undefined) 
    {
        if (newPassword !== undefined) 
        {

            const [salt, hash] = mc.hash(newPassword);
            await query.updateAt('users', 'password = $1, salt = $2', 'id = $3', [hash, salt, req.user.id]);

            res.status(200).send({ message: "Successfully updated password" });
            return;
        
        } 
        else 
        {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } 
    else 
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets current profile id, username, and profile picture information
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/profile', async(req, res) => {
    if (req.user !== undefined)
    {
        const user = await query.execOne('id, username, profilePicture', 'users', 'id = $1', [req.user.id]);
        res.status(200).json(user);
        return;
    }
    else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Change profile picture of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/profilepicture/update', async(req, res) => {
    const profilePicture = req.body['profilePicture'];
    if (req.user !== undefined) 
    {
        if (profilePicture !== undefined)
        {

            const regex = /\.jpeg$|\.jpg$|\.png$/;
            const match = profilePicture.match(regex);
            if (match === null)
            {
                res.status(400).send({ error: "Incorrect profile picture format" });
                return;
            } 
            else
            {
                
                await query.updateAt('users', 'profilePicture = $1', 'id = $2', [profilePicture, req.user.id]);
                res.status(200).json({ message: "Successfully updated profile picture" });
                return;
            }
        }
        else
        {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    }
    else
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets username of a given user
// @param userID
// @return 200 exists or 400 bad request status code
app.post('/user/username', async(req, res) => {
    const userID = req.body['userID'];
    if (userID !== undefined) {

        const user = await query.execOneOrNone('username', 'users', 'id = $1', [userID]);

        if (user !== null) {
            res.status(200).json(user.username);
            return;
        } else {
            res.status(400).send({ error: "User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets userID of a given username
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/userID', async(req, res) => {
    const username = req.body['username'];
    if(username !== undefined){

        const user = await query.execOneOrNone('id', 'users', 'username = $1', [username]);

        if(user !== null){
            res.status(200).json(user.id);
            return;
        }
        else{
            res.status(400).send({error: "Username not found"});
            return;
        }
    }
    else{
        res.status(400).send({error: "Bad Request - Invalid request message parameters"});
        return;
    }
});

// Gets profile picture from userID
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/profilepicture', async(req, res) => {
    const userID = req.body['userID'];
    if (userID !== undefined) {
       
        const user = await query.execOneOrNone('profilePicture', 'users', 'id = $1', [userID]);

        if (user !== null) {
            res.status(200).json(user.profilepicture);
            return;
        } else {
            res.status(400).send({ error: "User ID not found" });
            return;
        }
    } 
    else
    {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});


// Gets list of friends of a given user
// @return 200 exists or 400 bad request status code
app.get('/user/friends', async(req, res) => {
    if (req.user !== undefined) 
    {        
        const friends = await query.execAny('*', 'user_friends', 'userID = $1', [req.user.id]);
        res.status(200).json(friends);
        return;
    } 
    else
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Creates new friend in user friend list (registration)
// @param email, username, password, confirmPassword
// @return 200 approved or 400 bad request status code
app.post('/user/friends/add', async(req, res) => {
    const friendID = req.body['friendID'];
    if (req.user !== undefined) 
    {
        if (friendID !== undefined) 
        {
            // check friend user is actually exist in database
            const friendUser = await query.execOneOrNone('username', 'users', 'id = $1', [friendID]);

            if (friendUser !== null) 
            {
                // check friendID is NOT in friend's list

                const friendListCheck = await query.execOneOrNone('friendID', 'user_friends', 'userID = $1 AND friendID = $2', [req.user.id, friendID]);

                if (friendListCheck !== null) 
                {
                    res.status(401).send({ error: "FriendID already in friend list" });
                    return;
                }

                await query.insertInto('user_friends', '($1, $2)', [req.user.id, friendID]);
                await query.insertInto('user_friends', '($1, $2)', [friendID, req.user.id]);
                res.status(200).send({ message: "New friend added to friend list" });
                return;
            } 
            else 
            {
                res.status(401).send({ error: "Friend id not found" });
                return;
            }
        } 
        else 
        {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    }
    else 
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Removes friend from user friend list (registration)
// @param email, username, password, confirmPassword
// @return 200 approved or 400 bad request status code
app.post('/user/friends/remove', async(req, res) => {
    const friendID = req.body['friendID'];
    if (req.user !== undefined) 
    {
        if (friendID !== undefined) 
        {
            // check friend user is actually exist in database
            const friendUser = await query.execOneOrNone('username', 'users', 'id = $1', [friendID]);

            if (friendUser !== null) 
            {
                // check friendID is in friend's list

                const friendListCheck = await query.execOneOrNone('friendID', 'user_friends', 'userID = $1 AND friendID = $2', [req.user.id, friendID]);

                if (friendListCheck === null) 
                {
                    res.status(401).send({ error: "FriendID not in friend list" });
                    return;
                }

                await query.removeFrom('user_friends', '$1 = userID AND $2 = friendID', [req.user.id, friendID]);
                await query.removeFrom('user_friends', '$1 = userID AND $2 = friendID', [friendID, req.user.id]);
                res.status(200).send({ message: "Friend removed from friend list" });
                return;
            } 
            else 
            {
                res.status(401).send({ error: "Friend id not found" });
                return;
            }
        } 
        else 
        {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    }
    else 
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets list of friend usernames of a given user
// @param username, userID
// @return 200 exists or 400 bad request status code
app.get('/user/friends/allUsernames', (req, res) => {
    if (req.user !== undefined) {
        const user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
        if (user) {
            const friendList = user.friendList;
            const allUsers = datastore.users;
            const friendUsernames = [];
            for (const friendID of friendList) {
                if (!friendUsernames.includes(friendID)) {
                    const friend = allUsers.find(u => {
                        return u.id === friendID;
                    });
                    if (friend) {
                        friendUsernames.push(friend.username);
                    }
                }
            }
            res.status(200).json(friendUsernames);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets game list of game ratings of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/ratings', async(req, res) => {
    if (req.user !== undefined)
    {
        const ratings = await query.execAny('*', 'user_ratings', 'userID = $1', [req.user.id]);
        res.status(200).json(ratings);
        return;
    } 
    else
    {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});


// Create/update game rating 
// @param username, rating, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/update', async (req, res) => {
    const rating = req.body['rating'];
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (rating !== undefined && gameID !== undefined) {
            const ratingObj = await query.execAny('*', 'user_ratings', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
            // check if rating already in ratings list
            if (ratingObj.length !== 0) {
                await query.updateAt('user_ratings', 'rating = $1', 'userID = $2 AND gameID = $3', [parseInt(rating), req.user.id, gameID]);
                res.status(200).send({ message: "Updated game rating"});
                return;
            } else {
                await query.insertInto('user_ratings', '($1, $2, $3)', [req.user.id, gameID, parseInt(rating)]);
                res.status(200).send({ message: "New rating added to game"});
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Removes rating from user ratings list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/remove', (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });
            if (user) {
                const ratingObj = user.ratings.find(rating => {
                    return rating.gameID === gameID;
                });
                // check if rating list does not contain game
                if (!ratingObj) {
                    res.status(200).send({ message: "Game already not rated in user ratings list" });
                    return;
                } else {
                    user.ratings.splice(user.ratings.indexOf(ratingObj), 1);
                    res.status(200).send({ message: "Game removed from rating list"});
                    return;
                }
            } else {
                res.status(401).send({ error: "Username/User ID not found." });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets game list of game ratings of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/ratings/allTitles', (req, res) => {
    if (req.user !== undefined) {
        const user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
        if (user) {
            const gameList = datastore.games;
            const ratingList = user.ratings;
            const ratingTitles = [];
            for (const game of ratingList) {
                if (!ratingTitles.includes(game.gameID)) {
                    const ratedGame = gameList.find(g => {
                        return g.id === game.gameID;
                    });
                    if (ratedGame) {
                        ratingTitles.push(ratedGame.name);
                    }
                }
            }
            res.status(200).json(ratingTitles);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets wishlist of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist', async (req, res) => {
    if (req.user !== undefined) {
        const sortingObj = req.body['sorting'];
        const sortBy = sortingObj.sortBy;
        const order = sortingObj.order;
        let avg_order;
        if (sortBy === 'rating_count') {
            avg_order = order;
        } else {
        avg_order = 'DESC';
        }
        const wishlist = await query.execAny('*', 'user_wishlists INNER JOIN games ON user_wishlists.gameid = games.id', `userID = $1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order}`, [req.user.id]);
        res.status(200).json(wishlist);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Add game to wishlist
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist/add', async (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const wishlistObj = await query.execAny('*', 'user_wishlists', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
            // check if user already has game in wishlist
            if (wishlistObj.length !== 0) {
                res.status(200).send({ message: "User already has game in wishlist" });
                return;
            } else {
                await query.insertInto('user_wishlists', '($1, $2)', [req.user.id, gameID]);
                res.status(200).send({ message: "New game added to wishlist"});
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Remove game from wishlist
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist/remove', (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });
            if (user) {
                // check if user already has game in wishlist
                if (!user.wishlist.includes(gameID)) {
                    res.status(401).send({ error: "Game does not exist in user wishlist" });
                    return;
                } else {
                    user.wishlist.splice(user.wishlist.indexOf(gameID), 1);
                    res.status(200).send({ message: "Game removed from wishlist"});
                    return;
                }
            } else {
                res.status(401).send({ error: "Username/User ID not found." });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets recommendation list of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/recommendations', (req, res) => {
    if (req.user !== undefined) {
        const user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
        if (user) {
            const recommendationList = user.recommendations;
            res.status(200).json(recommendationList);
            return;
        } else {
            res.status(400).send({ error: "Username not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Adds recommendation to recommendation list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations/add', (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });

            if (user) {
                // check if user already has game in recommendations
                if (user.recommendations.includes(gameID)) {
                    res.status(401).send({ error: "User already has game in recommendations" });
                    return;
                } else {
                    user.recommendations.push(gameID);
                    res.status(200).send({ message: "New game added to recommendations"});
                    return;
                }
            } else {
                res.status(401).send({ error: "Username not found." });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Removes recommendation from recommendation list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations/remove', (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });

            if (user) {
                // check if user already has game in recommendation list
                if (!user.recommendations.includes(gameID)) {
                    res.status(401).send({ error: "Game does not exist in user recommendations" });
                    return;
                } else {
                    user.recommendations.splice(user.recommendations.indexOf(gameID), 1);
                    res.status(200).send({ message: "Game removed from recommendations"});
                    return;
                }
            } else {
                res.status(401).send({ error: "Username not found." });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return; 
    }
});

// Gets recommendation list or wishlist game info
// @param user recommendation list
// @return 200 exists or 400 bad request status code
app.post('/games/list/info', (req, res) => {
    const gameList = req.body['gameList'];
    const gameInfo = getGameInfo(gameList);
    if (gameInfo) {
        res.status(200).json(gameInfo);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"});
        return;
    }
});
/*
    TODO: CHANGE messageList structure for scale
    https://stackoverflow.com/questions/4785065/table-structure-for-personal-messages
*/
// Gets message list of given user
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/messages', (req, res) => {
    if (req.user !== undefined) {
        const user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
        if (user) {
            const messageList = user.messageList;
            res.status(200).json(messageList);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return; 
    }
});

// Removes message to from user's messagelist
// @param username, messageID
// @return 200 messageList or 400 bad request
app.post('/user/messages/remove', (req, res) => {
    const messageID = req.body['messageID'];
    if (req.user !== undefined) {
        if (messageID !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });
            if (user) {
                const messageObj = user.messageList.find(message => {
                    return message.id === messageID;
                });
                user.messageList.splice(user.messageList.indexOf(messageObj), 1);
                res.status(200).json(user.messageList);
                return;
            } else {
                res.status(400).send({ error: "Username/User ID not found" });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;  
    }
});

// Sends message to another user
// @param username, friendUsername, message
// @return 200 exists or 400 bad request status code
app.post('/messages/send', (req, res) => {
    const friendUsername = req.body['friendUsername'];
    const gameList = req.body['gameList'];
    if (req.user !== undefined) {
        if (friendUsername !== undefined && gameList !== undefined) {
            const user = datastore.users.find(u => {
                return req.user.id === u.id;
            });
            const friendUser = datastore.users.find(u => {
                return friendUsername === u.username;
            });
            if (user && friendUser) {
                const idIndex = friendUser.messageList.length;
                const message = {'id': idIndex.toString(), 'sender': req.user.username, 'title': faker.lorem.word(), 'message': JSON.stringify(gameList)};
                const messageObj = message;
                friendUser.messageList.push(messageObj);
                res.status(200).json({message: 'Successfully sent message to friend'});
                return;
            } else {
                res.status(400).send({ error: "Username or friend username not found" });
                return;
            }
        } else {
            res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;    
    }
});

// Gets game information from ID in database
// @param username, friendUsername, message
// @return 200 exists or 400 bad request status code
app.post('/games/find', async (req, res) => {
    const gameID = req.body['gameID'];
    if (gameID !== undefined) {
        const gameInfo = await query.execOne('*', 'games', 'id = $1', [gameID]);
        if (gameInfo !== null) {
            res.status(200).json(gameInfo);
            return;
        } else {
            res.status(400).send({error: "Bad Request - Game not found"}); 
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

app.get('/users/allUsers', (req, res) => {
    res.status(200).json(datastore.users);
});

app.get('/games/allTitles', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'games', '$1', [true]);
    const titleList = [];
    for (const genre of result) {
        titleList.push(genre.name);
    }
    res.status(200).json(titleList);
});

app.post('/games/allGames', async (req, res) => {
    const sortingObj = req.body['sorting'];
    const sortBy = sortingObj.sortBy;
    const order = sortingObj.order;
    let avg_order;
    if (sortBy === 'rating_count') {
        avg_order = order;
    } else {
        avg_order = 'DESC';
    }
    const result = await query.execAny('*', 'games', `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 100`, [true]);
    res.status(200).json(result);
});

app.get('/games/allGenres', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'genres', '$1', [true]);
    const genreList = [];
    for (const genre of result) {
        genreList.push(genre.name);
    }
    res.status(200).json(genreList);
});

app.get('/games/allPlatforms', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'platforms', '$1', [true]);
    const platformList = [];
    for (const genre of result) {
        platformList.push(genre.name);
    }
    res.status(200).json(platformList);
});

app.get('/games/allFranchises', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'franchise', '$1', [true]);
    const franchiseList = [];
    for (const genre of result) {
        franchiseList.push(genre.name);
    }
    res.status(200).json(franchiseList);
});

app.get('/games/allCompanies', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'companies', 'type = $1', ['developer']);
    const companyList = [];
    for (const genre of result) {
        companyList.push(genre.name);
    }
    res.status(200).json(companyList);
});

app.get('/games/allReleaseYears', async (req, res) => {
    const result = await query.execAny('DISTINCT release_date', 'games', '$1 ORDER BY release_date', [true]);
    const years = [];
    for (const year of result) {
        if (year.release_date !== null) {
            if (!years.includes(year.release_date.getFullYear())) {
                years.push(year.release_date.getFullYear());
            }
        }
    }
    res.status(200).json(years);
});

app.post('/game/list/filter/all', async (req, res) => {
    const genreFilterArr = req.body['genre'];
    const platformFilterArr = req.body['platform'];
    const franchiseFilterArr = req.body['franchise'];
    const companyFilterArr = req.body['company'];
    const ratingsFilterObj = req.body['rating'];
    const releaseYearFilterArr = req.body['release_year'];
    const releaseDecadeFilterArr = req.body['release_decade'];

    const sortingObj = req.body['sorting'];
    const sortBy = sortingObj.sortBy;
    const order = sortingObj.order;
    let avg_order;
    if (sortBy === 'rating_count') {
        avg_order = order;
    } else {
        avg_order = 'DESC';
    }

    let ratingFilter = false;
    let ratingGamesresult;

    if (Object.keys(ratingsFilterObj).length > 0 && ratingsFilterObj.value) {
        const highbound = parseInt(ratingsFilterObj['value-high']);
        const lowbound = parseInt(ratingsFilterObj['value-low']);

        ratingGamesresult = await query.execAny('*', 'user_ratings', 'userID = $1 AND rating > $2 AND rating < $3', [req.user.id, lowbound, highbound]);
        ratingFilter = true;  
    }

    if (ratingFilter && ratingGamesresult.length === 0) {
        res.status(200).json([]);
        return;
    }
    const [filterString, values] = createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr, false, null);
    const tables = 'games LEFT JOIN genres on games.id = genres.gameID LEFT JOIN franchise on games.id = franchise.gameID LEFT JOIN platforms on games.id = platforms.gameID LEFT JOIN companies on games.id = companies.gameID';
    const selectString = 'DISTINCT games.id, games.name, games.description, games.cover, games.release_date, games.screenshots, games.genre, games.platform, games.publisher, games.developer, games.franchise, games.series, games.game_modes, games.themes, games.player_perspectives, games.rating_count, games.rating_average';
    
    let gameResult;
    if (filterString.length === 0) {
        gameResult = await query.execAny(selectString, tables, `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 100`, [true]);
    } else {
        gameResult = await query.execAny(selectString, tables, filterString + ` ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 100`, values);
    }
    
    if (gameResult === null) {
        res.status(200).json([]);
        return;
    }

    res.status(200).json(gameResult);
    
});

app.post('/game/list/filter/custom', async (req, res) => {
    const genreFilterArr = req.body['genre'];
    const platformFilterArr = req.body['platform'];
    const franchiseFilterArr = req.body['franchise'];
    const companyFilterArr = req.body['company'];
    const ratingsFilterObj = req.body['rating'];
    const releaseYearFilterArr = req.body['release_year'];
    const releaseDecadeFilterArr = req.body['release_decade'];
    const userTableType = req.body['userTableType'];

    const sortingObj = req.body['sorting'];
    const sortBy = sortingObj.sortBy;
    const order = sortingObj.order;
    let avg_order;
    if (sortBy === 'rating_count') {
        avg_order = order;
    } else {
        avg_order = 'DESC';
    }

    const userGameListFilter = true;  
    let gameList = userTableType;
    const userGameIDs = await query.execAny('*', `${gameList}`, 'userID = $1', [req.user.id]);

    let ratingFilter = false;
    let ratingGamesresult;

    if (Object.keys(ratingsFilterObj).length > 0 && ratingsFilterObj.value) {
        const highbound = parseInt(ratingsFilterObj['value-high']);
        const lowbound = parseInt(ratingsFilterObj['value-low']);

        ratingGamesresult = await query.execAny('*', 'user_ratings', 'userID = $1 AND rating > $2 AND rating < $3', [req.user.id, lowbound, highbound]);
        ratingFilter = true;  
    }

    if (ratingFilter && ratingGamesresult.length === 0) {
        res.status(200).json([]);
        return;
    }

    const [filterString, values] = createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr, userGameListFilter, userGameIDs);
    const tables = 'games LEFT JOIN genres on games.id = genres.gameID LEFT JOIN franchise on games.id = franchise.gameID LEFT JOIN platforms on games.id = platforms.gameID LEFT JOIN companies on games.id = companies.gameID';
    const selectString = 'DISTINCT games.id, games.name, games.description, games.cover, games.release_date, games.screenshots, games.genre, games.platform, games.publisher, games.developer, games.franchise, games.series, games.game_modes, games.themes, games.player_perspectives, games.rating_count, games.rating_average';
    
    let gameResult;
    if (filterString.length === 0) {
        gameResult = await query.execAny(selectString, tables, `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 100`, [true]);
    } else {
        gameResult = await query.execAny(selectString, tables, filterString + ` ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 100`, values);
    }
    
    if (gameResult === null) {
        res.status(200).json([]);
        return;
    }

    res.status(200).json(gameResult);
});

function createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr,userGameListFilter, userGameIDs) {
    let counter = 1;
    const values = [];
    let filterString = '';

    if (userGameListFilter) {
        filterString = filterString + '(games.id = ';
        for (let i = 0; i < userGameIDs.length; i++) {
            if (i === userGameIDs.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(userGameIDs[i].gameid);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR games.id = ';
                values.push(userGameIDs[i].gameid);
                counter++;
            }
        }
    }

    if (ratingFilter) {
        filterString = filterString + '(games.id = ';
        for (let i = 0; i < ratingGamesresult.length; i++) {
            if (i === ratingGamesresult.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(ratingGamesresult[i].gameid);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR games.id = ';
                values.push(ratingGamesresult[i].gameid);
                counter++;
            }
        }
    }

    if (genreFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(genres.name = ';
        for (let i = 0; i < genreFilterArr.length; i++) {
            if (i === genreFilterArr.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(genreFilterArr[i]);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR genres.name = ';
                values.push(genreFilterArr[i]);
                counter++;
            }
        }
    }

    if (platformFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(platforms.name = ';
        for (let i = 0; i < platformFilterArr.length; i++) {
            if (i === platformFilterArr.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(platformFilterArr[i]);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR platforms.name = ';
                values.push(platformFilterArr[i]);
                counter++;
            }
        }
    }

    if (franchiseFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(franchise.name = ';
        for (let i = 0; i < franchiseFilterArr.length; i++) {
            if (i === franchiseFilterArr.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(franchiseFilterArr[i]);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR franchise.name = ';
                values.push(franchiseFilterArr[i]);
                counter++;
            }
        }
    }

    if (companyFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(companies.name = ';
        for (let i = 0; i < companyFilterArr.length; i++) {
            if (i === companyFilterArr.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(companyFilterArr[i]);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR companies.name = ';
                values.push(companyFilterArr[i]);
                counter++;
            }
        }
    }

    if (releaseYearFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(';
        for (let i = 0; i < releaseYearFilterArr.length; i++) {
            if (i === releaseYearFilterArr.length-1) {
                filterString = filterString + '(games.release_date >= ' + '$' + counter.toString() + ' AND games.release_date <= ' + '$' + (counter+1).toString() + '))';
                values.push(releaseYearFilterArr[i].toString() + '-01-01');
                values.push(releaseYearFilterArr[i].toString() + '-12-31');
                counter = counter+2;
            } else {
                filterString = filterString + '(games.release_date >= ' + '$' + counter.toString() + ' AND games.release_date <= ' + '$' + (counter+1).toString() + ') OR ';
                values.push(releaseYearFilterArr[i].toString() + '-01-01');
                values.push(releaseYearFilterArr[i].toString() + '-12-31');
                counter = counter+2;
            }
        }
    }

    if (releaseDecadeFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(';
        for (let i = 0; i < releaseDecadeFilterArr.length; i++) {
            if (i === releaseDecadeFilterArr.length-1) {
                filterString = filterString + '(games.release_date >= ' + '$' + counter.toString() + ' AND games.release_date <= ' + '$' + (counter+1).toString() + '))';
                values.push(releaseDecadeFilterArr[i].toString() + '-01-01');
                values.push((parseInt(releaseDecadeFilterArr[i])+10).toString() + '-12-31');
                counter = counter+2;
            } else {
                filterString = filterString + '(games.release_date >= ' + '$' + counter.toString() + ' AND games.release_date <= ' + '$' + (counter+1).toString() + ') OR ';
                values.push(releaseDecadeFilterArr[i].toString() + '-01-01');
                values.push((parseInt(releaseDecadeFilterArr[i])+10).toString() + '-12-31');
                counter = counter+2;
            }
        }
    }

    return [filterString, values];
}


function filterGenre(genreFilterArr, gameList) {
    if (genreFilterArr !== undefined && genreFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of genreFilterArr) {
                if (g.genre.includes(filter)) {
                    return true;
                }
            }
            return false;
        });
    }
    return gameList;
}

function filterPlatform(platformFilterArr, gameList) {
    if (platformFilterArr !== undefined && platformFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of platformFilterArr) {
                if (g.platform.includes(filter)) {
                    return true;
                }
            }
            return false;
        });
    } 
    return gameList;
}

function filterFranchise(franchiseFilterArr, gameList) {
    if (franchiseFilterArr !== undefined && franchiseFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of franchiseFilterArr) {
                if (g.franchise.includes(filter)) {
                    return true;
                }
            }
            return false;
        });
    } 
    return gameList;
}

function filterCompany(companyFilterArr, gameList) {
    if (companyFilterArr !== undefined && companyFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of companyFilterArr) {
                if (g.developers.includes(filter) || g.publishers.includes(filter)) {
                    return true;
                }
            }
            return false;
        });
    } 
    return gameList;
}

function releaseYearFilter(releaseYearFilterArr, gameList) {
    if (releaseYearFilterArr !== undefined && releaseYearFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of releaseYearFilterArr) {
                const date = filter;
                if (g.releaseDate.getFullYear() === date) {
                    return true;
                }
            }
            return false;
        });
    }
    return gameList;
}

function releaseDecadeFilter(releaseDecadeFilterArr, gameList) {
    if (releaseDecadeFilterArr !== undefined && releaseDecadeFilterArr.length > 0) {
        gameList = gameList.filter(g => {
            for (const filter of releaseDecadeFilterArr) {
                const dateEarlier = filter;
                const dateLater = filter+10;
                if (g.releaseDate.getFullYear() >= dateEarlier && g.releaseDate.getFullYear() <= dateLater) {
                    return true;
                }
            }
            return false;
        });
    }
    return gameList;
}

function ratingsFilter(user, ratingObj, gameList) {
    let highbound;
    let lowbound;
    if (ratingObj.value) {
        highbound = ratingObj['value-high'];
        lowbound = ratingObj['value-low'];
    } else {
        highbound = 0;
        lowbound = 0;
    }
    const user_ratings = user.ratings;
    gameList = gameList.filter(game => {
        const rating = findRatingGame(game.id, user_ratings);
        return (rating >= lowbound && rating <= highbound);
    });
    return gameList;
}

function findRatingGame(gameID, user_ratings) {
    const ratedGame = user_ratings.find(game => {
        return gameID === game.gameID;
    });
    if (ratedGame) {
        return ratedGame.rating;
    }
    return 0;
}

// Function that used gameList to return gameInfo for every game in list
function getGameInfo(gameList) {
    if (gameList !== undefined) {
        const gameInfo = [];
        for (const elem of gameList) {
            const gameObj = datastore.games.find(game => {
                if (elem.gameID === undefined) {
                    return game.id === elem;
                } else {
                    return game.id === elem.gameID;
                }
            });
            if (gameObj) {
                gameInfo.push(gameObj);
            }
        }
        return gameInfo;
    }
    return null;
}

// find list of games that nameStart substring matches with beginning
// @param nameStart
// @return list of games with matching name starts
app.post('/game/list/NameStartsWith', (req, res) => {
    let nameStart = req.body['titleSearch'];
    const list = req.body['list'];
    if (nameStart !== undefined) {
        let gameList = [];

        if (list !== undefined && list === 'ratings') {
            let user;
            if (req.user !== undefined) {
                user = datastore.users.find(u => {
                return req.user.id === u.id;
                });
            } else {
                res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
                return;
            }
            if (!user) {
                res.status(400).send({ error: "Username or friend username not found" });
                return;
            } else {
                gameList =  getGameInfo(user.ratings);
            }
        } else {
            gameList = datastore.games;
        }

        nameStart = nameStart.toLowerCase();
            gameList = gameList.filter(g => {
            const gameName = g.name.toLowerCase();
            return gameName.startsWith(nameStart);
        });
        if (gameList !== undefined) {
            res.status(200).json(gameList);
        } else {
            res.status(400).send({ error: "Username not found" });
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
    }
});

// gets list of games in sorted alphabetical order
// @param alphabetical (true is alphabetical, false is reverse)
// @return list of games in alphabetical order
app.post('/gameSort/all', (req, res) => {
    const alphabetical  = req.body['ordering'];
    if (alphabetical === undefined || typeof(alphabetical) !== "boolean") {
        res.status(400).send({ error: "Alphabetical order is not a boolean" });
    }
    const gameList = datastore.games;
    gameList.sort((a, b) => a.name.localeCompare(b.name));
    if (!alphabetical) {
        gameList.reverse();
    }
    res.status(200).json(gameList);
});

// gets list of games in sorted alphabetical order
// @param alphabetical (true is alphabetical, false is reverse)
// @return list of games in alphabetical order
app.post('/gameSort/recommendations', (req, res) => {
    const alphabetical  = req.body['ordering'];
    let user;
    if (req.user !== undefined) {
        user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
    if (!user) {
        res.status(400).send({ error: "Username or friend username not found" });
        return;
    }
    if (alphabetical === undefined || typeof(alphabetical) !== "boolean") {
        res.status(400).send({ error: "Alphabetical order is not a boolean" });
    }
    const gameList = getGameInfo(user.recommendations);
    gameList.sort((a, b) => a.name.localeCompare(b.name));
    if (!alphabetical) {
        gameList.reverse();
    }
    res.status(200).json(gameList);
});

// gets list of games in sorted alphabetical order
// @param alphabetical (true is alphabetical, false is reverse)
// @return list of games in alphabetical order
app.post('/gameSort/wishlist', (req, res) => {
    const alphabetical  = req.body['ordering'];
    let user;
    if (req.user !== undefined) {
        user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
    if (!user) {
        res.status(400).send({ error: "Username or friend username not found" });
        return;
    }
    if (alphabetical === undefined || typeof(alphabetical) !== "boolean") {
        res.status(400).send({ error: "Alphabetical order is not a boolean" });
    }
    const gameList = getGameInfo(user.wishlist);
    gameList.sort((a, b) => a.name.localeCompare(b.name));
    if (!alphabetical) {
        gameList.reverse();
    }
    res.status(200).json(gameList);
});

// gets list of games in sorted alphabetical order
// @param alphabetical (true is alphabetical, false is reverse)
// @return list of games in alphabetical order
app.post('/gameSort/ratings', (req, res) => {
    const alphabetical  = req.body['ordering'];
    let user;
    if (req.user !== undefined) {
        user = datastore.users.find(u => {
            return req.user.id === u.id;
        });
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
    if (!user) {
        res.status(400).send({ error: "Username or friend username not found" });
        return;
    }
    if (alphabetical === undefined || typeof(alphabetical) !== "boolean") {
        res.status(400).send({ error: "Alphabetical order is not a boolean" });
    }
    const gameList = getGameInfo(user.ratings);
    gameList.sort((a, b) => a.name.localeCompare(b.name));
    if (!alphabetical) {
        gameList.reverse();
    }
    res.status(200).json(gameList);
});

app.get('*', (req, res) => {
    res.status(404).send('No Endpoint Found');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    setup();
});


// finds all games that are after dateEarlier and before dateLater
// @param String dateEarlier, String dateLater (AS JSON.stringify() STRINGS!)
// @return list of games within dates
app.post('/game/list/releaseDate', (req, res) => {
    const dateEarlier = req.body['dateEarlier'];
    const dateLater  = req.body['dateLater'];
    const dateEarlierDate = new Date(dateEarlier);
    const dateLaterDate = new Date(dateLater);
    if (!(dateEarlierDate && dateLaterDate)) {
        res.status(400).send({ error: "Invalid date strings" });
        return;
    }
    if (dateEarlier > dateLater) {
        res.status(400).send({ error: "Earlier date is before later date" });
        return;
    }
    const gameList = datastore.games.filter(g => {
        return g.releaseDate >= dateEarlier && g.releaseDate <= dateLater;
    });
    if (!(gameList === undefined || gameList.length === 0)) {
        res.status(200).json(gameList);
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});

// game-related API endpoints
app.post('/game/list/genre', (req, res) => {
    const genre = req.body['genre'];
    if (genre !== undefined) {
        const gameList = datastore.games.filter(g => {
            return genre === g.genre;
        });
        if (!(gameList === undefined || gameList.length !== 0)) {
            res.status(200).json(gameList);
        } else {
            res.status(400).send({ error: "Username not found" });
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
    }
});

app.post('/game/list/platform', (req, res) => {
    const platform = req.body['platform'];
    if (platform !== undefined) {
        const gameList = datastore.games.filter(g => {
            return platform === g.platform;
        });
        if (!(gameList === undefined || gameList.length === 0)) {
            res.status(200).json(gameList);
        } else {
            res.status(400).send({ error: "Username not found" });
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
    }
});

app.post('/game/list/franchise', (req, res) => {
    const franchise = req.body['franchise'];
    if (franchise !== undefined) {
        const gameList = datastore.games.filter(g => {
            return franchise === g.franchise;
        });
        if (!(gameList === undefined || gameList.length === 0)) {
            res.status(200).json(gameList);
        } else {
            res.status(400).send({ error: "Username not found" });
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
    }
});
app.post('/game/list/company', (req, res) => {
    const company = req.body['company'];
    if (company !== undefined) {
        const gameList = datastore.games.filter(g => {
            return company === g.company;
        });
        if (!(gameList === undefined || gameList.length === 0)) {
            res.status(200).json(gameList);
        } else {
            res.status(400).send({ error: "Username not found" });
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
    }
});