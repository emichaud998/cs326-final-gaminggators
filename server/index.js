'use strict';
// initialize library constants
const crypto = require('crypto');
const faker = require('faker'); // temporary to generate fake data
const express = require('express');
const app = express();

 // initialize custom constants
 const port = 8080;

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

// initialize helper functions
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

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

    const password_1 = getHashedPassword('hunter1');
    const password_2 = getHashedPassword('hunter2');
    const password_3 = getHashedPassword('hunter3');
    const password_4 = getHashedPassword('hunter4');

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

    const messageList_1 = [{id : '0001', sender : 'Chris_Redfield', message : 'Hi Jill! You should check out Amnesia!'}];
    const messageList_2 = [{id : '0002', sender : 'Jill_Valentine', message : 'Hi Chris! You should check out Outlast!'}, {id : '0003', sender : 'Claire_Redfield', message : 'Hi Chris! You should check out Layers of Fear!'}];
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

app.use('/', express.static('client/src'));
app.use(express.json()); // lets you handle JSON input

// User login to an acocunt
// @param email, password
// @return 200 authorized or 401 unauthorized status code
app.post('/user/login', (req, res) => {
    // curl -X POST -d '{ "email" : "tshee@umass.edu", "password" : "secretSecret3" }' -H "Content-Type: application/json" http://localhost:3000/signin
    const username = req.body['username'];
    const password  = req.body['password'];
    if (username !== undefined && password !== undefined) {
        const hashedPassword = getHashedPassword(password);
        const user = datastore.users.find(u => {
            return u.username === username && hashedPassword === u.password;
        });
        if (user) {
            res.status(200).send({ message: "Login successful." });
            return;
        } else {
            res.status(401).send({ error: "Invalid username or password" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Create new user (registration)
// @param email, username, password, confirmPassword
// @return 200 approved OR 400 bad request OR 409 Conflict 
app.post('/user/register', (req, res) => {
    const email = req.body['email'];
    const username = req.body['username'];
    const password = req.body['password'];
    if (email !== undefined && username !== undefined && password !== undefined) {
        if (datastore.users.find(user => user.email === email)) {
            res.status(409).send({ error: "Bad Request - User email already in use." });
        }
        else if (datastore.users.find(user => user.username === username)) {
            res.status(409).send({ error: "Bad Request - User username already in use." });
        }
        const hashedPassword = getHashedPassword(password);
        datastore.users.push({
            id: faker.random.number().toString(),
            username: username,
            email: email,
            password: hashedPassword,
            profilePicture: faker.image.avatar(),
            friendList: [],
            messageList: [],
            ratings: [],
            wishlist: [],
            recommendations: []
        });
        res.status(200).send({ message: "Registered. Check your email for verification." });
        return;
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Updates user username
// @param oldUsername, newUsername
// @return 200 exists or 400 bad request status code
app.post('/user/username/update', (req, res) => {
    const userID = req.body['userID'];
    const oldUsername = req.body['oldUsername'];
    const newUsername = req.body['newUsername'];
    if (newUsername !== undefined && oldUsername !== undefined) {
        if (oldUsername === newUsername) {
            res.status(401).send({ error: "New username cannot equal old username" });
            return;
        } else if (datastore.users.find(user => user.username === newUsername)) {
            res.status(401).send({ error: "New username already in use." });
            return;
        } else {
            let user;
            if (userID !== undefined) {
                user = datastore.users.find(u => {
                    return userID === u.id;
                });
            } else {
                user = datastore.users.find(u => {
                    return oldUsername === u.username;
                });
            }
            if (user) {
                user.username = newUsername;
                res.status(200).json({ message: "Successfully updated username" });
                return;
            } else {
                res.status(400).send({ error: "Username/User ID not found" });
                return;
            }
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Updates user password
// @param username, newPassword
// @return 200 exists or 400 bad request status code
app.post('/user/password/update', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const newPassword = req.body['newPassword'];
    if ((username !== undefined || userID !== undefined) && newPassword !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const hashedPassword = getHashedPassword(newPassword);
            user.password = hashedPassword;
            res.status(200).send({ message: "Successfully updated password" });
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets full profile information of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/profile', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            res.status(200).json(user);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Change profile picture of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/profilepicture/update', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const profilePicture = req.body['profilePicture'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const regex = /\.jpeg$|\.jpg$|\.png$/;
            const match = profilePicture.match(regex);
            if (match === null) {
                res.status(400).send({ error: "Incorrect profile picture format" });
                return;
            } else {
                user.profilePicture = profilePicture;
                res.status(200).json({ message: "Successfully updated profile picture" });
                return;
            }
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets username of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/username', (req, res) => {
    const userID = req.body['userID'];
    if (userID !== undefined) {
        const user = datastore.users.find(u => {
            return userID === u.id;
        });
        if (user) {
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
app.post('/user/userID', (req, res) => {
    const username = req.body['username'];
    if(username !== undefined){
        const user = datastore.users.find(u => {
            return username === u.username;
        });
        if(user){
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

// Gets profile picture from userID or username
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/profilepicture', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            res.status(200).json(user.profilePicture);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});


// Gets list of friends of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/friends', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const friendList = user.friendList;
            res.status(200).json(friendList);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Creates new friend in user friend list (registration)
// @param email, username, password, confirmPassword
// @return 200 approved or 400 bad request status code
app.post('/user/friends/add', (req, res) => {
    const userID = req.body['userID'];
    const friendID = req.body['friendID'];
    
    if (userID !== undefined && friendID !== undefined) {
        // check both users actually exist in database
        const user = datastore.users.find(u => {
            return userID === u.id;
        });
        const friendUser = datastore.users.find(u => {
            return friendID === u.id;
        });
        if (user && friendUser) {
            // check friendUsername is NOT in friend's list
            if (user.friendList.includes(friendID)) {
                res.status(401).send({ error: "Username already in friend list" });
                return;
            }
            user.friendList.push(friendID);
            friendUser.friendList.push(userID);
            res.status(200).send({ message: "New friend added to friend list" });
            return;
        } else {
            res.status(401).send({ error: "Username or friend id not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Removes friend from user friend list (registration)
// @param email, username, password, confirmPassword
// @return 200 approved or 400 bad request status code
app.post('/user/friends/remove', (req, res) => {
    const userID = req.body['userID'];
    const friendID = req.body['friendID'];
    
    if (userID !== undefined && friendID !== undefined) {
        // check both users actually exist in database
        const user = datastore.users.find(u => {
            return userID === u.id;
        });
        const friendUser = datastore.users.find(u => {
            return friendID === u.id;
        });
        if (user && friendUser) {
            // check friendUsername is NOT in friend's list
            if (!user.friendList.includes(friendID)) {
                res.status(401).send({ error: "Username not found in friend list" });
                return;
            }
            user.friendList.splice(user.friendList.indexOf(friendID), 1);
            friendUser.friendList.splice(friendUser.friendList.indexOf(userID), 1);
            res.status(200).send({ message: "Friend removed from friend list" });
            return;
        } else {
            res.status(401).send({ error: "Username or friend id not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets list of friend usernames of a given user
// @param username, userID
// @return 200 exists or 400 bad request status code
app.post('/user/friends/allUsernames', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const friendList = user.friendList;
            const allUsers = datastore.users;
            const friendUsernames = [];
            for (const friendID of friendList) {
                if (!friendUsernames.includes(friendID.gameID)) {
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
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets game list of game ratings of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/ratings', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const ratingList = user.ratings;
            res.status(200).json(ratingList);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});


// Create/update game rating 
// @param username, rating, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/update', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const rating = req.body['rating'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && rating !== undefined && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }

        if (user) {
            const ratingObj = user.ratings.find(rating => {
                return rating.gameID === gameID;
            });
            // check if user has rated game before
            if (ratingObj) {
                ratingObj.rating = rating;
                res.status(200).send({ message: "Updated game rating"});
                return;
            } else {
                user.ratings.push({
                    gameID: gameID,
                    rating: rating
                });
                res.status(200).send({ message: "New rating added to game"});
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
});

// Removes rating from user ratings list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/remove', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
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
});

// Gets game list of game ratings of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/ratings/allTitles', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
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
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Gets wishlist of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const wishlist = user.wishlist;
            res.status(200).json(wishlist);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Add game to wishlist
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist/add', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }

        if (user) {
            // check if user already has game in wishlist
            if (user.wishlist.includes(gameID)) {
                res.status(401).send({ error: "User already has game in wishlist" });
                return;
            } else {
                user.wishlist.push(gameID);
                res.status(200).send({ message: "New game added to wishlist"});
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
});

// Remove game from wishlist
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/wishlist/remove', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }

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
});

// Gets recommendation list of a given user
// @param username
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const recommendationList = user.recommendations;
            res.status(200).json(recommendationList);
            return;
        } else {
            res.status(400).send({ error: "Username not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Adds recommendation to recommendation list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations/add', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }

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
});

// Removes recommendation from recommendation list
// @param username, gameID
// @return 200 exists or 400 bad request status code
app.post('/user/recommendations/remove', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const gameID = req.body['gameID'];
    if ((username !== undefined || userID !== undefined) && gameID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }

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
});

// Gets recommendation list game info
// @param user recommendation list
// @return 200 exists or 400 bad request status code
app.post('/games/list/info', (req, res) => {
    const gameList = req.body['gameList'];
    if (gameList !== undefined) {
        const gameInfo = [];
        for (const rating of gameList) {
            const gameObj = datastore.games.find(game => {
                return game.id === rating.gameID;
            });
            if (gameObj) {
                gameInfo.push(gameObj);
            }
        }
        res.status(200).json(gameInfo);
        return;
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"});
        return;
    }
});

// Gets recommendation list game info
// @param user recommendation list
// @return 200 exists or 400 bad request status code
app.post('/games/list/info', (req, res) => {
    const gameList = req.body['gameList'];
    if (gameList !== undefined) {
        const gameInfo = [];
        for (const elem of gameList) {
            const gameObj = datastore.games.find(game => {
                if (game.id !== undefined) {
                    return game.id === elem;
                } else {
                    return game.id === elem.gameID;
                }
            });
            if (gameObj) {
                gameInfo.push(gameObj);
            }
        }
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
app.post('/user/messages', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    if (username !== undefined || userID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const messageList = user.messageList;
            res.status(200).json(messageList);
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Sends message to another user
// @param username, messageID
// @return 200 exists or 400 bad request status code
app.post('/user/messages/remove', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const messageID = req.body['messageID'];
    if ((username !== undefined || userID !== undefined) && messageID !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        if (user) {
            const messageObj = user.messageList.find(message => {
                return message.id === messageID;
            });
            user.messageList.splice(user.messageList.indexOf(messageObj), 1);
            res.status(200).send({message: 'Successfully removed message from inbox'});
            return;
        } else {
            res.status(400).send({ error: "Username/User ID not found" });
            return;
        }
    } else {
        res.status(400).send({error: "Bad Request - Invalid request message parameters"}); 
        return;
    }
});

// Sends message to another user
// @param username, friendUsername, message
// @return 200 exists or 400 bad request status code
app.post('/messages/send', (req, res) => {
    const userID = req.body['userID'];
    const username = req.body['username'];
    const friendUsername = req.body['friendUsername'];
    const message = req.body['message'];
    if ((username !== undefined || userID !== undefined) && friendUsername !== undefined && message !== undefined) {
        let user;
        if (userID !== undefined) {
            user = datastore.users.find(u => {
                return userID === u.id;
            });
        } else {
            user = datastore.users.find(u => {
                return username === u.username;
            });
        }
        const friendUser = datastore.users.find(u => {
            return friendUsername === u.username;
        });
        if (user && friendUser) {
            const idIndex = friendUser.messageList.length;
            const messageObj = {'id': idIndex.toString(),'sender': user.username, 'message': message};
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
});

// Gets list of all games in database
// @param username, friendUsername, message
// @return 200 exists or 400 bad request status code
app.post('/games/find', (req, res) => {
    const gameID = req.body['gameID'];
    if (gameID !== undefined) {
        const gameInfo = datastore.games.find(g => {
            return gameID === g.id;
        });
        if (gameInfo) {
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

app.get('/games/allTitles', (req, res) => {
    res.status(200).json(game_title_list);
});

app.get('/games/allGames', (req, res) => {
    res.status(200).json(datastore.games);
});

app.get('/games/allGenres', (req, res) => {
    res.status(200).json(genre_list);
});

app.get('/games/allPlatforms', (req, res) => {
    res.status(200).json(platform_list);
});

app.get('/games/allFranchises', (req, res) => {
    res.status(200).json(franchise_list);
});

app.get('/games/allCompanies', (req, res) => {
    res.status(200).json(company_list);
});

app.get('/games/allReleaseYears', (req, res) => {
    res.status(200).json(release_years_list);
});

// HAVE NOT LOOKED AT OR MODIFIED THESE BELOW YET//
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

// finds all games that are above ratingsLow and below ratingsHigh
// @param ratingsLow (0 to 5), ratingsHigh (0 to 5)
// @return list of games within ratings
app.post('/game/list/ratings', (req, res) => {
    const ratingsLow = req.body['ratingsLow'];
    const ratingsHigh = req.body['ratingsHigh'];
    if (ratingsLow !== undefined && ratingsHigh !== undefined) {
        if (ratingsLow > ratingsHigh) {
            res.status(400).send({ error: "Low rating threshold above high rating threshold" });
            return;
        }
        const gameList = datastore.games.filter(g => {
            return g.ratingAverage >= ratingsHigh && g.ratingAverage <= ratingsLow;
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

// find list of games that nameStart substring matches wtih beginning
// @param nameStart
// @return list of games with matching name starts
app.post('/game/list/NameStartsWith', (req, res) => {
    const { nameStart } = req.body;
    const gameList = datastore.games.filter(g => {
        return g.name.startsWith(nameStart);
    });
    if (!(gameList === undefined || gameList.length === 0)) {
        res.status(200).json(gameList);
    } else {
        res.status(400).send({ error: "Username not found" });
    }
});

// gets list of games in sorted alphabetical order
// @param alphabetical (true is alphabetical, false is reverse)
// @return list of games in alphabetical order
app.post('/gameSort', (req, res) => {
    const { alphabetical } = req.body;
    if (typeof alphabetical !== "boolean") {
        res.status(400).send({ error: "Alphabetical order is not a boolean" });
    }
    datastore.games.sort((a, b) => a.name.localeCompare(b.name));
    if (!alphabetical) {
        datastore.games.reverse();
    }
    res.status(200).json(datastore.games);
});

app.get('*', (req, res) => {
    res.status(404).send('No Endpoint Found');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    setup();
});