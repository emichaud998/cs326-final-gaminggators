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

Description goes here

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

Description goes here

<br/>

### user_wishlists Table
| Column              | Data Type | Description                              |
|---------------------|-----------|------------------------------------------|
| userID              | integer   | user id with this game in their wishlist |
| gameID              | integer   | game id that is in this user's wishlist  |

<br/>

Description goes here

<br/>

### user_ratings Table
| Column              | Data Type | Description                |
|---------------------|-----------|----------------------------|
| userID              | integer   | user id who did the rating |
| gameID              | integer   | game id that was rated     |
| rating              | integer   | the rating given           |

<br/>

Description goes here

<br/>

### user_recommendations Table
| Column              | Data Type | Description                            |
|---------------------|-----------|----------------------------------------|
| userID              | integer   | user id who has this recommended game  |
| gameID              | integer   | game that is being recommended to user |

<br/>

Description goes here

<br/>

### user_friends Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | user's id                |
| friendID            | integer   | friend's id              |

<br/>

Description goes here

<br/>

### user_ignore Table
| Column              | Data Type | Description                   |
|---------------------|-----------|-------------------------------|
| userID              | integer   | user id who ignored this game |
| gameID              | integer   | game id that was ignored      |

<br/>

Description goes here

<br/>

### user_messages Table
| Column              | Data Type | Description                                     |
|---------------------|-----------|-------------------------------------------------|
| userID              | integer   | user id who recieved the message                |
| messageID           | SERIAL    | unique identified of message in ascending order |
| title               | varchar   | title of the message                            |
| message             | varchar   | contents of the message                         |

<br/>

Description goes here

<br/>

## Breakdown of Labor

### Emily Michaud - emichaud998
* 

### Nicholas Michaud - namichaud
* 

### Timothy Shee - Borghese-Gladiator
* 