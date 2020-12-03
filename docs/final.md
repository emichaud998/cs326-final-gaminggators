# Gaming Gators
## Gamer Port
* https://gamer-port.herokuapp.com/
### Semester
* Fall 2020

### Overview
    Here is the overview of Gamer Port

### Team Contributers:
* Emily Michaud - emichaud998
* Nicholas Michaud - namichaud
* Timothy Shee - Borghese-Gladiator

### User Interface
<br/>

### API Endpoints (POST)
<br/>

#### /user/login

This endpoint takes in a username and password and logs in the user that those two credentials represent if they are valid. If valid, redirects the user to their private dashboard page, otherwise redirects the user back to log in page.
<br/>
<br/>

#### /user/register

This endpoint takes in a username, and password and registers a new user with those credentials as long as the username is not already in use.
<br/>
<br/>

#### /user/username/update

This endpoint takes in a new username that the current user wants to update their username to. It then updates that user's username in the database unless that new username is already taken. The user can update their username with the reset username textbox on the profile page.
<br/>
<br/>

#### /user/password/update

This endpoint takes in a userID or username or both as well as a new password in order to reset the password for the user whose userID it is. The user can choose their password with the reset password textbox on the profile page.
<br/>
<br/>

#### /user/profilepicture

This endpoint takes in a userID and gets the corresponding profile picture for the user with that userID.
<br/>
<br/>

#### /user/profilepicture/update

This endpoint takes in a url to a png, or jpg file in order to set the current user's profile picture as a new picture found on the web by storing the URL in the database. A user can do this by entering a URL in the set profile picture textbox on the profile webpage.
<br/>
<br/>

#### /user/username

This endpoint takes in a userID and returns the username of the user that corresponds with that userID if and only if that userID is valid.
<br/>
<br/>

#### /user/userID

This endpoint takes in a username and returns the userID of the user that corresponds with that username if and only if that username is in use by some user
<br/>
<br/>

#### /user/friends/add

This endpoint takes in a friend ID to be added the current user’s friend list. It adds both users to each other's friend lists if the friend ID is valid and both users are not already friends.
<br/>
<br/>

#### /user/friends/remove

This endpoint takes in a friend ID to be removed from the current user’s friend's list. It removes both users from each other's friend list in the database.
<br/>
<br/>

#### /user/ratings/info

This endpoint returns a list of game objects containing information for each game in the current user’s list of rated games. It takes in a sorting object that indicates how the list of game objects should be sorted.
<br/>
<br/>

#### /user/ratings/update

This endpoint takes in a rating score and a gameID in order to add a new rating for that corresponding game to the current user's rating list. If the game is already in the user’s ratings list, it will update that game’s rating to the new rating that is passed in. It will only add/update the user’s rating list if the gameID is valid.
<br/>
<br/>

#### /user/ratings/remove

This endpoint takes in a gameID in order to remove the rating corresponding to that gameID from the current user's rating list. It will only do this if the gameID is valid and the game is in the signed in user's ratings list.
<br/>
<br/>

#### /user/wishlist

This endpoint returns the wishlist of the currently signed in user. This returned wishlist consists of a list of game objects containing information for each game in the current user’s wishlist. It takes in a sorting object that indicates how the list of game objects should be sorted.
<br/>
<br/>

#### /user/wishlist/add

This endpoint takes in a gameID to add to the currently signed in user's wishlist, which is a list of gameIDs. There are many places in the application where you can press add to wishlist buttons to add games to your wishlist.
<br/>
<br/>

#### /user/wishlist/remove

This endpoint takes in a gameID to remove from the currently signed in user's wishlist. A game will only be successfully removed from the user’s wishlist if the passed in gameID is valid and is in the user’s wishlist. A user can accomplish this by clicking on the Remove button on any game card on the wishlist page when their wishlist is not empty.
<br/>
<br/>

#### /user/recommendations

This endpoint returns the recommendation list of the currently signed in user, running a recommendation algorithm to create this list of recommended games based on the user’s ratings. This returned recommendation list consists of a list of game objects containing information for each game in the current user’s recommendation list. It takes in a sorting object that indicates how the list of game objects should be sorted.
<br/>
<br/>

#### /user/recommendations/remove

This endpoint takes in a gameID to remove a from the current user's recommendation list. This is done by the user by clicking the Not Interested button on the recommendations page. This is only successful if the game to be removed is in the user's recommendations list.
<br/>
<br/>

#### /games/list/info

This endpoint takes in an array of custom game lists from recommendations or wishlist and returns all of the game information from each game in that list. This includes gameID, game cover, game name, game genre, game platform, and more for each game in the list.
<br/>
<br/>

#### /user/messages/remove

This endpoint takes in a messageID to remove the message corresponding to that messageID from the current user's message list. This is successful only if the messageID is in the current user’s message list.
<br/>
<br/>

#### /messages/send

This endpoint takes in a friend username and a game list to send in a message from the currently signed in user to the friend corresponding to the friend username that is passed in. This endpoint creates a message containing a unique messageID, a message title that contains the user’s name and the type of list they are sending, and a message body containing the user’s game list they want to send. It then stores the message in the friend’s message list. This will only work if both users are friends with each other.
<br/>
<br/>

#### /games/singleGame

This endpoint takes in a gameID and returns a game object containing all the information about the game that shares that gameID.
<br/>
<br/>

#### /games/allGames
This endpoint returns a list of game objects containing information for each game for every stored game in the database. It takes in a sorting object that indicates how the list of game objects should be sorted.
<br/>
<br/>

#### /game/list/filter/all

This endpoint takes in a list of filtering criteria for each filter type (genre, platform, franchise, company, release year, release decade), a rating filter object to filter by rating, and a sorting object that indicates how the list of game objects should be sorted. Using all the filtering criteria that is passed in, a SQL filter string is created in order to filter all games in the database by all the filters passed in. This endpoint then returns a list of game objects containing information for each game in this filtered game list.
<br/>
<br/>

#### /game/list/filter/custom

This endpoint takes in a list of filtering criteria for each filter type (genre, platform, franchise, company, release year, release decade), a rating filter object to filter by rating, and a sorting object that indicates how the list of game objects should be sorted. This endpoint also takes in a userTableType string that indicates whether the currently signed in user’s wishlist or ratings list should be filtered and returned. Using all the filtering criteria that is passed in, a SQL filter string is created in order to filter the user’s wishlist/rating list by all the filters passed in. This endpoint then returns a list of game objects containing information for each game in this filtered game list.
<br/>
<br/>

#### /game/list/Search

This endpoint takes in a titleSearch string which contains the string the currently signed in user has searched by, and returns a list of games objects containing that titleSearch string in their title. It also takes in a sorting object that indicates how the list of game objects should be sorted.
<br/>
<br/>

#### /game/search/filter

This endpoint takes in a list of filtering criteria for each filter type (genre, platform, franchise, company, release year, release decade), a rating filter object to filter by rating, and a sorting object that indicates how the list of game objects should be sorted. This endpoint also takes in a searchList, which contains a list of gameIDs that were returned in a previous search. Using all the filtering criteria that is passed in, a SQL filter string is created in order to filter all games in the database by all the filters passed in, while only including the games whose IDs are in the searchList. This endpoint then returns a list of game objects containing information for each game in this filtered game list.
<br/>
<br/>

### API Endpoints (GET)
<br/>

#### /games/allTitles

This endpoint returns a list of all the game titles of every game in the database.
<br/>
<br/>

#### /games/allGenres

This endpoint returns a list of all the distinct game genre names in the database.
<br/>
<br/>

#### /games/allPlatforms

This endpoint returns a list of all the distinct platform names in the database.
<br/>
<br/>

#### /games/allFranchises

This endpoint returns a list of all the distinct franchise names in the database.
<br/>
<br/>

#### /games/allCompanies

This endpoint returns a list of all the distinct game developer company names in the database.
<br/>
<br/>

#### /games/allReleaseYears

This endpoint returns a list of all the distinct release years of all games in the database.
<br/>
<br/>

#### /user/logout

This endpoint handles the logging out of the currently signed in user and redirects the signed out user back to the login page.
<br/>
<br/>

#### /user/profile

This endpoint returns the full profile information for the user that is currently signed in. The profile includes the user’s userID, username, and profile picture.
<br/>
<br/>

#### /user/friends

This endpoint returns the corresponding friends list for the user that is currently signed in. This friends list is a list of every friend’s userID.
<br/>
<br/>

#### /user/friends/allUsernames

This endpoint returns a list of all the usernames in the current user’s friend list.
<br/>
<br/>

#### /user/ratings

This endpoint returns a list of all the game IDs and their corresponding rating scores in the current user’s list of rated games.
<br/>
<br/>

#### /user/ratings/allTitles

This endpoint returns a list of all the game titles from the currently signed in user's ratings list.
<br/>
<br/>

#### /user/messages

This endpoint returns the messages list that corresponds to the currently signed in user. This message list contains a list of message objects that contain a messageID, title, and message body containing the sender’s wishlist/rating list. 
<br/>
<br/>

### Database
<br/>

#### Games Table
| Column              | Data Type | Description                                                        |
|---------------------|-----------|--------------------------------------------------------------------|
| id                  | integer   | unique id for game                                                 |
| name                | varchar   | title of game                                                      |
| description         | varchar   | description of game                                                |
| cover               | varchar   | filepath of cover art picture                                      |
| release_date        | date      | date game was released                                             |
| follows             | integer   | number of people following game                                    |
| rating_count        | integer   | number of people who rated game                                    |
| rating_average      | decimal   | average rating score for game                                      |
| screenshots         | varchar   | filepath of screenshots for game in stringifyied array             |
| genre               | varchar   | games' genre(s) in stringifyied array                              |
| platform            | varchar   | games' platform(s) in stringifyied array                           |
| publisher           | varchar   | games' publisher(s) in stringifyied array                          |
| developer           | varchar   | games' developer(s) in stringifyied array                          |
| franchise           | varchar   | franchise the game belongs to in stringifyied array                |
| series              | varchar   | series the game belongs to                                         |
| game_modes          | varchar   | singleplayer, splitscreen, multiplayer, etc. in stringifyied array |
| themes              | varchar   | games' themes in stringifyied array                                |
| similar_games       | varchar   | ids for games that are similar to this one in stringifyied array   |
| player_perspectives | varchar   | first person, third person, etc. in stringifyied array             |
| alternative_names   | varchar   | other names for this game in stringifyied array                    |

<br/>

The games table is a table that holds all of the information about every game in the database. Every game has a unique id for identifying the game, a title, a description, cover art and screenshots, genre, themes, and more. This table is used to create the game cards and the game overlay webpage. The genres and themes information is used for finding recommendations on the recommendations webpage. The filters in the application also use this table extensively to give the user the games they are asking for with specific criteria. Altogether, this table contains all the information for each game in our application.

<br/>

#### users Table
| Column              | Data Type | Description                                         |
|---------------------|-----------|-----------------------------------------------------|
| id                  | SERIAL    | unique id for user that is given in ascending order |
| username            | varchar   | username for user                                   |
| password            | varchar   | users hashed password                               |
| salt                | varchar   | salt for password confidentiality                   |
| profilePicture      | varchar   | url/pathname for user's profile picture             |

<br/>

The users table is a table that holds all of the information about every user in the database. When a user registers, they are given a unique id. The username and password they registered with can be used to sign in. The password is saved as a hash of the actual password with a salt added to the end. For authentication this means for a user to login, the salt must be appended to their password and then hashed to check if the password matches the hash in the password column for that user. The profile page is saved as a path to a default picture when the user first makes their account. This picture can later be changed on the profile webpage with a URL to a png or jpg file. The username and password can also be changed on the profile webpage.

<br/>

#### user_wishlists Table
| Column              | Data Type | Description                              |
|---------------------|-----------|------------------------------------------|
| userID              | integer   | user id with this game in their wishlist |
| gameID              | integer   | game id that is in this user's wishlist  |

<br/>

The user_wishlists table is a table that matches a userID with a gameID if that gameID is in the user's wishlist. This table is used to render the cards that are supposed to appear on the wishlist webpage. On this webpage wishlist games can be removed from the wishlist which deletes this matching in the database. Any game cards in the application can be added to a user's wishlist. This table is also used to make sure that no wishlist games show up in your recommendations page.

<br/>

#### user_ratings Table
| Column              | Data Type | Description                |
|---------------------|-----------|----------------------------|
| userID              | integer   | user id who did the rating |
| gameID              | integer   | game id that was rated     |
| rating              | integer   | the rating given           |

<br/>

The user_ratings table contains all the games that users rate from 1 to 5 stars. If a user rates a game 3 stars for example, the uses's id is put in userID, the game's id is put in gameID and the rating 3 is put into rating. This table is used to show the games webpage which shows all your ratings which you can filter by. It is also used in the stats box on the profile page and the bar graph on the games webpage. This table in the database is also used to recommend games that share genres and themes with your highest rated games.

<br/>

#### user_recommendations Table
| Column              | Data Type | Description                            |
|---------------------|-----------|----------------------------------------|
| userID              | integer   | user id who has this recommended game  |
| gameID              | integer   | game that is being recommended to user |

<br/>

The user_recommendations table contains all recommended games for a user. This table is constantly emptied and remade every time a user clicks on the recommendations page. This is because recommendations change based on how and what games you rate. If you rate a racing game 4 stars then the racing genre gets 4 points. Whatever genres/themes have the most points, the more games in that genre/theme that get put in the recommendations table for that specific userID.

<br/>

#### user_friends Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | user's id                |
| friendID            | integer   | friend's id              |

<br/>

The user_friends table contains all users that are friends with eachother. This means that every matching of friends is in this table twice where the userID and friendID are swapped. On the profile page, a user can type in a username of another user and add them as a friend. This adds the user with that username to the current user's friend list and adds the current user to that username user's friendlist. This also means that when a friend is removed, both users are removed from eachother's friend list. The friend's list is used to send messages containing wishlists or ratings that you may want to share with friends.

<br/>

#### user_ignore Table
| Column              | Data Type | Description                   |
|---------------------|-----------|-------------------------------|
| userID              | integer   | user id who ignored this game |
| gameID              | integer   | game id that was ignored      |

<br/>

The user_ignore table is only used for the recommendation algorithm on the recommendation webpage. When a user scrolls through their recommendations they will be given the choice to add a game to their wishlist, or ignore it. If they choose the latter, the game is put into this table with that current user's userID. Next time the recommendations page is loaded, this game will be excluded from the list.

<br/>

#### user_messages Table
| Column              | Data Type | Description                                                       |
|---------------------|-----------|-------------------------------------------------------------------|
| userID              | integer   | user id who received the message                                  |
| messageID           | SERIAL    | unique identified of message in ascending order                   |
| title               | varchar   | title of the message- contains sender username and game list type |
| message             | varchar   |  contents of the message- contains sender game list               |

<br/>

The user_messages table contains all the information for individual messages sent to user's. These messages have a unique id, a title, and a body(message in the db). When the messages page is opened, this table is used to grab all messages that the current user has matched with them. These messages usually contain wishlists or rating lists sent by the user's friends. Messages can also be deleted from this table on the messages page by clicking the appropriate button.

<br/>

### URL Routes/Mappings
<br/>

### Authentication/Authorization
<br/>

### Division of Labor
#### Emily Michaud - emichaud998
* Browse Games HTML/CSS
* Recommendations HTML/CSS
* Games HTML/CSS (Ratings)
* Game card overlay HTML/CSS
* Wireframes
* Browse Games Frontend
* Recommendations Frontend
* Games Frontend (Ratings)
* Game card overlay Frontend
* Dummy Server Implementation
* Passport Authentication
* Backend Game Cards
* Backend Filtering
* Backend Browse Games
* Backend Game Overlay Page
* Search Bars Backend
* Fetched IGDB Game Database Information Using Scripts
* Downloaded Game Cover Images Locally
* Heroku Setup
* Final Markdown

#### Nicholas Michaud - namichaud
* Profile HTML/CSS
* Wishlist HTML/CSS
* Games HTML/CSS (Graph)
* Home HTML/CSS
* Wireframes
* Milestone 1 Markdown
* Profile Frontend
* Wishlist Frontend
* Games Frontend (Graph)
* Milestone 2 Markdown
* Login/Register Backend
* Profile Page Backend
* Wishlist Backend
* Ratings Backend
* Recommendations Backend
* Recommendations Algorithm
* Milestone 3 Markdown
* Final Markdown

#### Timothy Shee - Borghese-Gladiator
* Sign In HTML/CSS
* Register HTML/CSS
* Messages HTML/CSS
* Sign In Frontend
* Register Frontend
* Messages Frontend
* Navigation Bar Implementation
* Messages Backend
* Pagination of Browse Games
* Pagination of Messages

### Conclusion
    Here is a conclusion