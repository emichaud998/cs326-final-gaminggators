# Milestone 3: Back-end Implementation

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

## Relational Database Tables

<br/>

### Games Table
| Column              | Data Type | Description                                  |
|---------------------|-----------|----------------------------------------------|
| id                  | integer   | unique id for game                           |
| name                | varchar   | title of game                                |
| description         | varchar   | description of game                          |
| cover               | varchar   | filepath of cover art picture                |
| release_date        | date      | date game was released                       |
| follows             | integer   | number of people following game              |
| rating_count        | integer   | number of people who rated game              |
| rating_average      | decimal   | average rating score for game                |
| screenshots         | varchar   | filepath of screenshots for game             |
| genre               | varchar   | games' genre(s)                              |
| platform            | varchar   | games' platform(s)                           |
| publisher           | varchar   | games' publisher(s)                          |
| developer           | varchar   | games' developer(s)                          |
| franchise           | varchar   | franchise the game belongs to                |
| series              | varchar   | series the game belongs to                   |
| game_modes          | varchar   | singleplayer, splitscreen, multiplayer, etc. |
| themes              | varchar   | games' themes                                |
| similar_games       | varchar   | ids for games that are similar to this one   |
| player_perspectives | varchar   | first person, third person, etc.             |
| alternative_names   | varchar   | other names for this game                    |

<br/>

The games table is a table that holds all of the information about every game in the database. Every game has a unique id for identifying the game, a title, a description, cover art and screenshots, genre, themes, and more. This table is used to create the game cards and the game overlay webpage. The genres and themes information is used for finding recommendations on the recommendations webpage. The filters in the application also use this table extensovely to give the user the games they are asking for with specific criteria. Altogether, this table contains all the information for each game in our application.

<br/>

### users Table
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

### user_wishlists Table
| Column              | Data Type | Description                              |
|---------------------|-----------|------------------------------------------|
| userID              | integer   | user id with this game in their wishlist |
| gameID              | integer   | game id that is in this user's wishlist  |

<br/>

The user_wishlists table is a table that matches a userID with a gameID if that gameID is in the user's wishlist. This table is used to render the cards that are supposed to appear on the wishlist webpage. On this webpage wishlist games can be removed from the wishlist which deletes this matching in the database. Any game cards in the application can be added to a user's wishlist. This table is also used to make sure that no wishlist games show up in your recommendations page.

<br/>

### user_ratings Table
| Column              | Data Type | Description                |
|---------------------|-----------|----------------------------|
| userID              | integer   | user id who did the rating |
| gameID              | integer   | game id that was rated     |
| rating              | integer   | the rating given           |

<br/>

The user_ratings table contains all the games that users rate from 1 to 5 stars. If a user rates a game 3 stars for example, the uses's id is put in userID, the game's id is put in gameID and the rating 3 is put into rating. This table is used to show the games webpage which shows all your ratings which you can filter by. It is also used in the stats box on the profile page and the bar graph on the games webpage. This table in the database is also used to recommend games that share genres and themes with your highest rated games.

<br/>

### user_recommendations Table
| Column              | Data Type | Description                            |
|---------------------|-----------|----------------------------------------|
| userID              | integer   | user id who has this recommended game  |
| gameID              | integer   | game that is being recommended to user |

<br/>

The user_recommendations table contains all recommended games for a user. This table is constantly emptied and remade every time a user clicks on the recommendations page. This is because recommendations change based on how and what games you rate. If you rate a racing game 4 stars then the racing genre gets 4 points. Whatever genres/themes have the most points, the more games in that genre/theme that get put in the recommendations table for that specific userID.

<br/>

### user_friends Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | user's id                |
| friendID            | integer   | friend's id              |

<br/>

The user_friends table contains all users that are friends with eachother. This means that every matching of friends is in this table twice where the userID and friendID are swapped. On the profile page, a user can type in a username of another user and add them as a friend. This adds the user with that username to the current user's friend list and adds the current user to that username user's friendlist. This also means that when a friend is removed, both users are removed from eachother's friend list. The friend's list is used to send messages containing wishlists or ratings that you may want to share with friends.

<br/>

### user_ignore Table
| Column              | Data Type | Description                   |
|---------------------|-----------|-------------------------------|
| userID              | integer   | user id who ignored this game |
| gameID              | integer   | game id that was ignored      |

<br/>

The user_ignore table is only used for the recommendation algorithm on the recommendation webpage. When a user scrolls through their recommendations they will be given the choice to add a game to their wishlist, or ignore it. If they choose the latter, the game is put into this table with that current user's userID. Next time the recommendations page is loaded, this game will be excluded from the list.

<br/>

### user_messages Table
| Column              | Data Type | Description                                     |
|---------------------|-----------|-------------------------------------------------|
| userID              | integer   | user id who recieved the message                |
| messageID           | SERIAL    | unique identified of message in ascending order |
| title               | varchar   | title of the message                            |
| message             | varchar   | contents of the message                         |

<br/>

The user_messages table contains all the information for individual messages sent to user's. These messages have a unique id, a title, and a body(message in the db). When the messages page is opened, this table is used to grab all messages that the current user has matched with them. These messages usually contain wishlists or rating lists sent by the user's friends. Messages can also be deleted from this table on the messages page by clicking the appropriate button.

<br/>

## Breakdown of Labor

### Emily Michaud - emichaud998
* Passport Authentication
* Backend Game Cards
* Backend Filtering
* Backend Browse Games
* Backend Game Overlay Page
* Search Bars Backend
* Fetched IGDB Game Database Information Using Scripts
* Downloaded Game Cover Images Locally
* Heroku Setup

### Nicholas Michaud - namichaud
* Login/Register Backend
* Profile Page Backend
* Wishlist Backend
* Ratings Backend
* Recommendations Backend
* Recommendations Algorithm
* Milestone 3 Documentation

### Timothy Shee - Borghese-Gladiator
* Messages Backend
* Pagination of Browse Games
* Pagination of Messages