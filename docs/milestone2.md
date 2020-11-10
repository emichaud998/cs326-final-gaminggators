# Milestone 2: Front-end JavaScript 

## Team Name
Gaming Gators

## Web Application Name
Gamer Port

## Team Contributers:
* Emily Michaud - emichaud998
* Nicholas Michaud - namichaud
* Timothy Shee - Borghese-Gladiator

## Heroku URL
https://gamer-port.herokuapp.com/

## Screenshots





## API Endpoints (POST)

### /user/login

This endpoint takes in a username and password and logs in the user that those two credentials represent if they are valid.

### /user/register

This endpoint takes in an email, username, and password and registers a new user with those credentials as long as the username and email are not already in use.

### /user/username/update

This endpoint takes in either an email, username, or both. It then updates that user's username to whatever they have entered in the reset username text box on the profile page unless that new username is already taken.

### /user/password/update

This endpoint takes in a userID or username or both as well as a new password in order to reset the password for the user whose userID it is. The user can choose their password with the reset password textbox on the profile page.

### /user/profile

This endpoint takes in a userID or username or both in order to return the full profile information for that user. The profile includes things like userID, username, profile picture, hashed password, friendslist, messages, ratings, recommendations, and wishlist.

### /user/profilepicture

This endpoint takes in a userID or username or both and gets the corresponding profile picture for the user with that userID/username.

### /user/profilepicture/update

This endpoint takes in a userID or username or both as well as a url to a png, or jpg file in order to set the user's profile picture as a new picture found on the web. A user can do this by entering a url in the set profile picture textbox on the profile webpage.

### /user/username

This endpoint takes in a userID and returns the username of the user that corresponds with that userID if and only if that userID is in use by some user

### /user/userID

This endpoint takes in a username and returns the userID of the user that corresponds with that username if and only if that username is in use by some user

### /user/friends

This endpoint takes in a userID, username, or both and gets the corresponding friends list for the user that shares that userID or username.

### /user/friends/add

This endpoint takes in two userID's. One is the current user ID and one is the friend ID to be added. It then adds both users to eachother'ss friend lists if both ids are valid and both users are not already friends.

### /user/friends/remove

This endpoint takes in two userID's. One is the current user ID and one is the friend ID to be removed from the friend's list. It then removes both users from eachother's 

### /user/friends/allUsernames

This endpoint takes in a userID, username, or both and returns a list of all the friend usernames of that user.

### /user/ratings

This endpoint takes in a userID, username, or both and returns a list of all the games with their information that the user has rated.

### /user/ratings/update

This endpoint takes in a userID, username, or both as well as a rating number and a gameID in order to add a new rating to that user's rating list. It will only do this if the userID and gameID are valid.

### /user/ratings/remove

This endpoint takes in a userID, username, or both as well as a rating number and a gameID in order to remove a rating from that user's rating list. It will only do this if the userID and gameID are valid and the game is in that user's rating list.

### /user/ratings/allTitles

This endpoint takes in a userID or a username or both and returns a list of all the games with their information from that user's ratings.

### /user/wishlist

This endpoint takes in a userID or a username or both and gets the wishlist of the user that corresponds to that id or username

### /user/wishlist/add

This endpoint takes in a userID or a username or both as well as a gameID to add to the user's wishlist. There are many places in the application where you can press add to wishlist buttons to add games to your wishlist.

### /user/wishlist/remove

This endpoint takes in a userID or a username or both as well as a gameID to remove from the user's wishlist. A user can accomplish this by clicking on the Remove button on any game card on the wishlist page when their wishlist is not empty.

### /user/recommendations

This endpoint takes in a userID or a username or both and returns the recommendation list for that user.

### /user/recommendations/add

This endpoint takes in a userID or a username or both as well as a gameID to add a game to that user's recommendation list. 

### /user/recommendations/remove

This endpoint takes in a userID or a username or both as well as a gameID to remove a game from that user's recommendation list. This is done by the user by clicking the Not Interested button on the recommendations page. This is only successful if the game in question is in the user's recommendations list.

### /games/list/info

This endpoint takes in an array of custom game lists from recommendations or wishlist and returns all of the game information from each game in that list. This includes gameID, game cover, game name, game genre, game platform, and more for each game in the list.

### /user/messages

This endpoint takes in a userID or username or both and returns the messages list that corresponds with that user.

### /user/messages/remove

This endpoint takes in a userID, or username, or both as well as a messageID to remove a message from the user's message list who has this userID and username. This only works if the userID and username is valid and the messageID is in their message list

### /messages/send

This endpoint takes in a userID or username or both as well as a friend username and a message to send to that friend. It then puts the message in the friend username's message list and says it is from the user matching userID and username. This will only work if both users are friends with eachother.

### /games/find

This endpoint takes in a gameID and returns all the information about the game object that shares that gameID.

### /game/list/filter/all

This endpoint filters the list of all games by a specific filter passed in to the endpoint.

#### /game/list/filter/custom

This endpoint will filter the games in a user's wishlist, recommendation, ratings, or browse games tab.

### /game/list/NameStartsWith

This endpoint takes in a titleSearch string and returns a list of games thats name starts with that titleSearch string.

### /gameSort/all

This endpoint gets a list of games sorted in alphabetical order.

### /gameSort/recommendations

This endpoint gets a list of game recommendations sorted in alphabetical order. 

### /gameSort/wishlist

This endpoint gets a wishlist sorted in alphabetical order.

### /gameSort/ratings

This endpoint gets a game ratings list sorted in alphabetical order.

### /game/list/releaseDate

This endpoints gets takes in two parameters for dateEarlier and dateLater. It then returns a list of all games that have a release date between those two dates.

## API Endpoints (GET)

### /users/allUsers

This endpoint gets a list of all the user objects.

### /games/allTitles

This endpoint gets all the game titles.

### /games/allGames

This endpoint gets all the  the game objects.

### /games/allGenres

This endpoint gets all the game genres.

### /games/allPlatforms

This endpoint gets all the game platforms.

### /games/allFranchises

This endpoint gets all the game franchises.

### /games/allCompanies

This endpoint gets all the game companies

### /games/allReleaseYears

This endpoint gets all the game release years

## Breakdown of Labor

### Emily Michaud - emichaud998
* Browse Games Frontend
* Recommendations Frontend
* Games Frontend (Ratings)
* Game card overlay Frontend
* Dummy Server Implementation

### Nicholas Michaud - namichaud
* Profile Frontend
* Wishlist Frontend
* Games Frontend (Graphs)
* Milestone 2 Markdown

### Timothy Shee - Borghese-Gladiator
* Sign In Frontend
* Register Frontend
* Messages Frontend
* Navigation Bar Implementation