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
const datastore = [];

const minicrypt = require('./miniCrypt');
const mc = new minicrypt();

 // initialize custom constants
 const port = process.env.PORT || 8080;

 query.databaseConnectionSetup();

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
async function addUser(username, password) {
    const user = await findUser(username);
	if (!user) {
		const [salt, hash] = mc.hash(password);
        await query.insertIntoUsers(username, hash, salt);

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
app.post('/user/register',
    async(req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (username !== undefined && password !== undefined) {
            // Check if we successfully added the user.
            // If so, redirect to '/login'
            // If not, redirect to '/register'.
            if (await addUser(username, password)) {
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
// @param newUsername
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
// @param newPassword
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
// @param profile picture URL
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
// @param friendID
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
// @param friendID
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

// Gets list of all friend usernames of a given user
// @return 200 exists or 400 bad request status code
app.get('/user/friends/allUsernames', async (req, res) => {
    if (req.user !== undefined) {
            const friendList = await query.execAny('DISTINCT users.username', 'users INNER JOIN user_friends ON users.id = user_friends.friendID', 'user_friends.userID = $1', [req.user.id]);
            const friendUsernameList = [];
            for (const friendUsername of friendList) {
                friendUsernameList.push(friendUsername.username);
            }
            res.status(200).json(friendUsernameList);
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets game list of game ratings of a given user
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

// Gets rating list of a given user with all game information
// @param sorting_instructions
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/info', async (req, res) => {
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
        const ratingList = await query.execAny('*', 'user_ratings INNER JOIN games ON user_ratings.gameid = games.id', `userID = $1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order}`, [req.user.id]);
        res.status(200).json(ratingList);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});


// Create/update game rating 
// @param rating, gameID
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
// @param gameID
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/remove', async (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const ratingObj = await query.execAny('*', 'user_ratings', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
            // check if rating already in ratings list
            if (ratingObj.length === 0) {
                res.status(401).send({ error: "Game does not exist in user rating list" });
                return;
            } else {
                await query.removeFrom('user_ratings', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
                res.status(200).send({ message: "Rating removed from game list"});
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

// Gets game list of game ratings titles of a given user
// @return 200 exists or 400 bad request status code
app.get('/user/ratings/allTitles',async (req, res) => {
    if (req.user !== undefined) {
        const ratingList = await query.execAny('DISTINCT games.name', 'user_ratings INNER JOIN games ON user_ratings.gameID = games.id', 'user_ratings.userID = $1', [req.user.id]);
        const ratingTitles = [];
        for (const game of ratingList) {
            ratingTitles.push(game.name);
        }
        res.status(200).json(ratingTitles);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

// Gets wishlist of a given user
// @param sorting_instructions
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
// @param gameID
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
// @param gameID
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist/remove', async (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const wishlistObj = await query.execAny('*', 'user_wishlists', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
            // check if user already has game in wishlist
            if (wishlistObj.length === 0) {
                res.status(401).send({ error: "Game does not exist in user wishlist" });
                return;
            } else {
                await query.removeFrom('user_wishlists', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
                res.status(200).send({ message: "Game removed from wishlist"});
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
// @param sorting_instructions
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations', async (req, res) => {
    //Remove from recommendations
    await query.removeAll('user_recommendations');

    const recommendCount = 20;

    //Call helper function to get list of gameID recommendations (array of IDs) - check that game not in wishlist or ignore games
    const matchedGames = await findRecommendations(req.user.id); 

    //for loop through ids and call recommendations add function passing in each gameID

    for(let i = 0; i < recommendCount; i++)
    {
        if(i < matchedGames.length)
        {
            await addToRecommendations(req.user.id, matchedGames[i]);
        }
    }

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
        const recommendations = await query.execAny('*', 'user_recommendations INNER JOIN games ON user_recommendations.gameid = games.id', `userID = $1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order}`, [req.user.id]);
        res.status(200).json(recommendations);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Not signed in"}); 
        return;
    }
});

//Finds game reccommendations
// @param count

async function findRecommendations(userID)
{
    const pointsObj = await getRatingPoints(userID);

    const genrePoints = pointsObj.genrePointsKey;
    const themePoints = pointsObj.themePointsKey;

    const genreArr = Object.entries(genrePoints);
    const themeArr = Object.entries(themePoints);

    genreArr.sort(function(a, b) {
        return a[1] - b[1];
    });

    themeArr.sort(function(a, b) {
        return a[1] - b[1];
    });

    genreArr.reverse();
    themeArr.reverse();

    let longerLength = 0;

    if(genreArr.length >= themeArr.length)
    {
        longerLength = genreArr.length;
    }
    else
    {
        longerLength = themeArr.length;
    }

    const matchedGames = [];

    for(let i = 0; i< longerLength; i++)
    {

        if(i >= genreArr.length && i >= themeArr.length){break;}

        if(i < genreArr.length)
        {
            const curGenre = genreArr[i][0];
            const recGames = await getRecGamesGenre(curGenre, userID); 

            for(let j = 0; j < recGames.length; j++)
            {
                matchedGames.push(recGames[j]);
            }
        }

        if(i < themeArr.length)
        {
            const curTheme = themeArr[i][0];
            const recGames = await getRecGamesTheme(curTheme, userID); 

            for(let j = 0; j < recGames.lengh; j++)
            {
                matchedGames.push(recGames[j]);
            }
        }
    }

    return matchedGames;
}

//gets recommended games with that genre

async function getRecGamesGenre(genre, userID)
{
    const recGames = [];
    const genreGameIDs = await query.execAny('id', 'games', 'UPPER(genre) like UPPER($1)', [`%${genre}%`]);
    const wishlist = await query.execAny('gameID', 'user_wishlists', 'userID = $1', [userID]);
    const ignored = await query.execAny('gameID', 'user_ignore', 'userID = $1', [userID]);
    const rated = await query.execAny('gameID', 'user_ratings', 'userID = $1', [userID]);

    const ratedArr = [];
    const igArr = [];
    const wishArr = [];

    for(let r = 0; r < rated.length; r++)
    {
        ratedArr.push(rated[r].gameid);
    }

    for(let w = 0; w < wishlist.length; w++)
    {
        wishArr.push(wishlist[w].gameid);
    }

    for(let x = 0; x < ignored.length; x++)
    {
        igArr.push(ignored[x].gameid);
    }

    for(let i = 0; i<genreGameIDs.length; i++)
    {
        const id = genreGameIDs[i].id;

        if(!wishArr.includes(id))
        {
            if(!igArr.includes(id))
            {
                if(!ratedArr.includes(id))
                {
                    recGames.push(id);
                }
            }
        }
    }
    return recGames;
}

//gets recommended games with that theme

async function getRecGamesTheme(theme, userID)
{
    const recGames = [];
    const themeGameIDs = await query.execAny('id', 'games', 'UPPER(themes) like UPPER($1)', [`%${theme}%`]);
    const wishlist = await query.execAny('gameID', 'user_wishlists', 'userID = $1', [userID]);
    const ignored = await query.execAny('gameID', 'user_ignore', 'userID = $1', [userID]);
    const rated = await query.execAny('gameID', 'user_ratings', 'userID = $1', [userID]);

    const ratedArr = [];
    const igArr = [];
    const wishArr = [];

    for(let r = 0; r < rated.length; r++)
    {
        ratedArr.push(rated[r].gameid);
    }

    for(let w = 0; w < wishlist.length; w++)
    {
        wishArr.push(wishlist[w].gameid);
    }

    for(let x = 0; x < ignored.length; x++)
    {
        igArr.push(ignored[x].gameid);
    }

    for(let i = 0; i<themeGameIDs; i++)
    {
        const id = themeGameIDs[i].id;
        if(!wishArr.includes(id))
        {
            if(!igArr.includes(id))
            {
                if(!ratedArr.includes(id)){
                    recGames.push(id);
                }
            }
        }
    }
    return recGames;
}

//Calculates a point system for getting this user's most liked genre and themes

async function getRatingPoints(userID)
{
    const ratings = await query.joinRatedGames(userID);
    const genrePoints = {};
    const themePoints = {};

    for(let i = 0; i < ratings.length; i++)
    {
        const rate = ratings[i];
        const genres = JSON.parse(rate.genre);
        const themes = JSON.parse(rate.themes);
        const score = rate.rating;

        if(genres === null || genres === undefined || genres.length === 0){continue;}

        for(let i = 0; i < genres.length; i++)
        {
            if(genres[i] in genrePoints)
            {
                genrePoints[genres[i]] = genrePoints[genres[i]] + score;
            }
            else
            {
                genrePoints[genres[i]] = score;
            }
        }

        if(themes === null || themes === undefined || themes.length === 0){continue;}

        for(let i = 0; i < themes.length; i++)
        {
            if(themes[i] in themePoints)
            {
                themePoints[themes[i]] = themePoints[themes[i]] + score;
            }
            else
            {
                themePoints[themes[i]] = score;
            }
        }
    }

    return {genrePointsKey: genrePoints, themePointsKey: themePoints};
}

// Adds recommendation to recommendation list
// @param userID, gameID

async function addToRecommendations(userID, gameID){
    if (gameID !== undefined) 
    {
        const recommendationsObj = await query.execAny('*', 'user_recommendations', 'userID = $1 AND gameID = $2', [userID, gameID]);
        // check if user already has game in recommendation list

        if (recommendationsObj.length !== 0) 
        {
            return 0;
        } 
        else 
        {
            await query.insertInto('user_recommendations', '($1, $2)', [userID, gameID]);
            return 0;
        }
    } 
    else 
    {
        return -1;
    }
}

// Removes recommendation from recommendation list
// @param gameID
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations/remove', async (req, res) => {
    const gameID = req.body['gameID'];
    if (req.user !== undefined) {
        if (gameID !== undefined) {
            const recommendationObj = await query.execAny('*', 'user_recommendations', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
            // check if user already has game in recommendation list
            if (recommendationObj.length === 0) {
                res.status(401).send({ error: "Game does not exist in user recommendation list" });
                return;
            } else {
                await query.removeFrom('user_recommendations', 'userID = $1 AND gameID = $2', [req.user.id, gameID]);
                await query.insertInto('user_ignore', '($1, $2)', [req.user.id, gameID]);
                
                res.status(200).send({ message: "Game removed from recommendations"});
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

/*
    CHANGE messageList structure for scale
    https://stackoverflow.com/questions/4785065/table-structure-for-personal-messages
*/
// Gets message list of given user
// @param username
// @return 200 exists or 400 bad request status code
app.get('/user/messages', async (req, res) => {
    if (req.user !== undefined) {
        if (req.user.id !== undefined) {
            const messageList = await query.execAny('*', 'user_messages', 'userid = $1', [req.user.id]);
            res.status(200).json(messageList);
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - unknown user"}); 
        return; 
    }
});

// Removes message to from user's messagelist
// @param username, messageID
// @return 200 messageList or 400 bad request
app.post('/user/messages/remove', async (req, res) => {
    const messageID = req.body['messageID'];
    if (req.user !== undefined) {
        if (messageID !== undefined) {
            await query.removeFrom('user_messages', 'userID = $1 AND messageID = $2', [req.user.id, messageID]);
            res.status(200).send({ message: "Message removed from list"});
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
// @param username, friendUsername
// @return 200 exists or 400 bad request status code
app.post('/messages/send', async (req, res) => {
    const friendUsername = req.body['friendUsername'];
    const gameList = req.body['gameList'];
    // const title = req.body['title'];
    // const message = req.body['message'];

    if (req.user !== undefined) {
        if (friendUsername !== undefined && gameList !== undefined && title !== undefined && message !== undefined) {
            const friendID = findUser(friendUsername)

            if (friendID) {
                const friendMessageList = await query.execAny('*', 'user_messages', 'userid = $1', [friendID]);
                const userMessageList = await query.execAny('*', 'user_messages', 'userid = $1', [req.user.id]);
                const title = `${friendUsername} Sent You Their Wishlist`
                const idIndex = userMessageList.length;
                await query.insertInto('user_messages', '($1, $2, $3, $4)', [req.user.id, idIndex, title, friendMessageList]);
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

// Gets specific game information from ID in database
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

// Gets all users in database
app.get('/users/allUsers', (req, res) => {
    res.status(200).json(datastore.users);
});

// Gets list of titles of all games in DB
app.get('/games/allTitles', async (req, res) => {
    const result = await query.execAny('DISTINCT name', 'games', '$1', [true]);
    const titleList = [];
    for (const genre of result) {
        titleList.push(genre.name);
    }
    res.status(200).json(titleList);
});

// gets information list of all games in DB
// @param sorting_instructions
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
    const result = await query.execAny('*', 'games', `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 102`, [true]);
    res.status(200).json(result);
});

// Gets list of all genre names in DB
app.get('/games/allGenres', async (req, res) => {
    const result = await query.execAny('DISTINCT genre', 'games', 'genre is not null AND $1', [true]);
    const genreList = [];
    for (const genreString of result) {
        const genreArr = JSON.parse(genreString.genre);
        for (const genre of genreArr) {
            if (!genreList.includes(genre)) {
                genreList.push(genre);
            }
        }   
    }
    res.status(200).json(genreList);
});

// Gets list of all platform names in DB
app.get('/games/allPlatforms', async (req, res) => {
    const result = await query.execAny('DISTINCT platform', 'games', 'platform is not null AND $1', [true]);
    const platformList = [];
    for (const platformString of result) {
        const platformArr = JSON.parse(platformString.platform);
        for (const platform of platformArr) {
            if (!platformList.includes(platform)) {
                platformList.push(platform);
            }
        }   
    }
    res.status(200).json(platformList);
});

// Gets list of all franchise names in DB
app.get('/games/allFranchises', async (req, res) => {
    const result = await query.execAny('DISTINCT franchise', 'games', 'franchise is not null AND $1', [true]);
    const franchiseList = [];
    for (const franchiseString of result) {
        const franchiseArr = JSON.parse(franchiseString.franchise);
        for (const franchise of franchiseArr) {
            if (!franchiseList.includes(franchise)) {
                franchiseList.push(franchise);
            }
        }   
    }
    res.status(200).json(franchiseList);
});

// Gets list of all company names in DB
app.get('/games/allCompanies', async (req, res) => {
    const result = await query.execAny('DISTINCT developer', 'games', 'developer is not null AND $1', [true]);
    const companyList = [];
    for (const companyString of result) {
        const companyArr = JSON.parse(companyString.developer);
        for (const company of companyArr) {
            if (!companyList.includes(company)) {
                companyList.push(company);
            }
        }   
    }
    res.status(200).json(companyList);
});

// Gets list of all release_years names in DB
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

// Endpoint that filters all games in DB given the passed in filtering instructions
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

        ratingGamesresult = await query.execAny('*', 'user_ratings', 'userID = $1 AND rating >= $2 AND rating <= $3', [req.user.id, lowbound, highbound]);
        ratingFilter = true;  
    }

    if (ratingFilter && ratingGamesresult.length === 0) {
        res.status(200).json([]);
        return;
    }
    const [filterString, values] = createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr, false, null, false, null);

    let gameResult;
    if (filterString.length === 0) {
        gameResult = await query.execAny('*', 'games', `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 102`, [true]);
    } else {
        gameResult = await query.execAny('*', 'games', filterString + ` ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 102`, values);
    }
    if (gameResult === null) {
        res.status(200).json([]);
        return;
    }

    res.status(200).json(gameResult);
    
});

// Endpoint that filters a user created game list given the passed in filtering instructions
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
    const gameList = userTableType;
    const userGameIDs = await query.execAny('*', `${gameList}`, 'userID = $1', [req.user.id]);

    let ratingFilter = false;
    let ratingGamesresult;

    if (Object.keys(ratingsFilterObj).length > 0 && ratingsFilterObj.value) {
        const highbound = parseInt(ratingsFilterObj['value-high']);
        const lowbound = parseInt(ratingsFilterObj['value-low']);

        ratingGamesresult = await query.execAny('*', 'user_ratings', 'userID = $1 AND rating >= $2 AND rating <= $3', [req.user.id, lowbound, highbound]);
        ratingFilter = true;  
    }

    if (ratingFilter && ratingGamesresult.length === 0) {
        res.status(200).json([]);
        return;
    }

    const [filterString, values] = createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr, userGameListFilter, userGameIDs, false, null);
    
    let gameResult;
    if (filterString.length === 0) {
        gameResult = await query.execAny('*', 'games', `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 104`, [true]);
    } else {
        gameResult = await query.execAny('*', 'games', filterString + ` ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 104`, values);
    }
    
    if (gameResult === null) {
        res.status(200).json([]);
        return;
    }

    res.status(200).json(gameResult);
});

// Function creates a DB filtering query string given the passed in filtering criteria
function createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr,userGameListFilter, userGameIDs, searchListFilter, searchListIDs) {
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

    if (searchListFilter) {
        filterString = filterString + '(games.id = ';
        for (let i = 0; i < searchListIDs.length; i++) {
            if (i === searchListIDs.length-1) {
                filterString = filterString + '$' + counter.toString() + ')';
                values.push(searchListIDs[i]);
                counter++;
            } else {
                filterString = filterString + '$' + counter.toString() + ' OR games.id = ';
                values.push(searchListIDs[i]);
                counter++;
            }
        }
    }

    if (ratingFilter) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
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
        filterString = filterString + '(UPPER(genre) LIKE ';
        for (let i = 0; i < genreFilterArr.length; i++) {
            if (i === genreFilterArr.length-1) {
                filterString = filterString + 'UPPER($' + counter.toString() + '))';
                values.push(`%${genreFilterArr[i]}%`);
                counter++;
            } else {
                filterString = filterString + 'UPPER($' + counter.toString() + ') OR UPPER(genre) LIKE ';
                values.push(`%${genreFilterArr[i]}%`);
                counter++;
            }
        }
    }

    if (platformFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(UPPER(platform) LIKE ';
        for (let i = 0; i < platformFilterArr.length; i++) {
            if (i === platformFilterArr.length-1) {
                filterString = filterString + 'UPPER($' + counter.toString() + '))';
                values.push(`%${platformFilterArr[i]}%`);
                counter++;
            } else {
                filterString = filterString + 'UPPER($' + counter.toString() + ') OR UPPER(platform) LIKE ';
                values.push(`%${platformFilterArr[i]}%`);
                counter++;
            }
        }
    }

    if (franchiseFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(UPPER(franchise) LIKE ';
        for (let i = 0; i < franchiseFilterArr.length; i++) {
            if (i === franchiseFilterArr.length-1) {
                filterString = filterString + 'UPPER($' + counter.toString() + '))';
                values.push(`%${franchiseFilterArr[i]}%`);
                counter++;
            } else {
                filterString = filterString + 'UPPER($' + counter.toString() + ') OR UPPER(franchise) LIKE ';
                values.push(`%${franchiseFilterArr[i]}%`);
                counter++;
            }
        }
    }

    if (companyFilterArr.length !== 0) {
        if (filterString.length > 0) {
            filterString = filterString + ' AND ';
        }
        filterString = filterString + '(UPPER(developer) LIKE ';
        for (let i = 0; i < companyFilterArr.length; i++) {
            if (i === companyFilterArr.length-1) {
                filterString = filterString + 'UPPER($' + counter.toString() + '))';
                values.push(`%${companyFilterArr[i]}%`);
                counter++;
            } else {
                filterString = filterString + 'UPPER($' + counter.toString() + ') OR UPPER(developer) LIKE ';
                values.push(`%${companyFilterArr[i]}%`);
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

// find list of games that nameStart substring matches with beginning
// @param nameStart
// @return list of games with matching name starts
app.post('/game/list/Search', async (req, res) => {
    const titleSearch = req.body['titleSearch'];
    const list = req.body['list'];

    const sortingObj = req.body['sorting'];
    const sortBy = sortingObj.sortBy;
    const order = sortingObj.order;
    let avg_order;
    if (sortBy === 'rating_count') {
        avg_order = order;
    } else {
        avg_order = 'DESC';
    }


    if (titleSearch !== undefined) {
        let gameList;
        if (list !== undefined && list === 'ratings') {
            gameList = 'user_ratings';
        } else {
            gameList = 'games';
        }

        let searchResults;
        if (gameList === 'games') {
            searchResults = await query.execAny('*', `${gameList}`, `UPPER(name) LIKE UPPER($1) ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order}`, [`%${titleSearch}%`]);
        } else {
            searchResults = await query.execAny('*', `${gameList} INNER JOIN games ON user_ratings.gameID = games.id`, `UPPER(games.name) LIKE UPPER($1) AND user_ratings.userID = $2 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order}`, [`%${titleSearch}%`, req.user.id]);
        }

        if (searchResults !== null) {
            res.status(200).json(searchResults);
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

app.post('/game/search/filter', async (req, res) => {
    const genreFilterArr = req.body['genre'];
    const platformFilterArr = req.body['platform'];
    const franchiseFilterArr = req.body['franchise'];
    const companyFilterArr = req.body['company'];
    const ratingsFilterObj = req.body['rating'];
    const releaseYearFilterArr = req.body['release_year'];
    const releaseDecadeFilterArr = req.body['release_decade'];
    const searchList = req.body['searchList'];

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

        ratingGamesresult = await query.execAny('*', 'user_ratings', 'userID = $1 AND rating >= $2 AND rating <= $3', [req.user.id, lowbound, highbound]);
        ratingFilter = true;  
    }

    if (ratingFilter && ratingGamesresult.length === 0) {
        res.status(200).json([]);
        return;
    }
    const [filterString, values] = createFilterString(ratingGamesresult, ratingFilter, genreFilterArr, platformFilterArr, franchiseFilterArr, companyFilterArr, releaseYearFilterArr, releaseDecadeFilterArr, false, null, true, searchList); 
    let gameResult;
    if (filterString.length === 0) {
        gameResult = await query.execAny('*', 'games', `$1 ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 102`, [true]);
    } else {
        gameResult = await query.execAny('*', 'games', filterString + ` ORDER BY games.${sortBy} ${order}, games.rating_average ${avg_order} LIMIT 102`, values);
    }
    
    if (gameResult === null) {
        res.status(200).json([]);
        return;
    }

    res.status(200).json(gameResult);
});

app.get('*', (req, res) => {
    res.status(404).send('No Endpoint Found');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});