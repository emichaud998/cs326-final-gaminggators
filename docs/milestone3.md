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
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| id                  | integer   | Description              |
| name                | varchar   | Description              |
| description         | varchar   | Description              |
| cover               | varchar   | Description              |
| release_date        | date      | Description              |
| follows             | integer   | Description              |
| rating_count        | integer   | Description              |
| rating_average      | decimal   | Description              |
| screenshots         | varchar   | Description              |
| genre               | varchar   | Description              |
| platform            | varchar   | Description              |
| publisher           | varchar   | Description              |
| developer           | varchar   | Description              |
| franchise           | varchar   | Description              |
| series              | varchar   | Description              |
| game_modes          | varchar   | Description              |
| themes              | varchar   | Description              |
| similar_games       | varchar   | Description              |
| player_perspectives | varchar   | Description              |
| alternative_names   | varchar   | Description              |

<br/>

### users Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| id                  | SERIAL    | Description              |
| username            | varchar   | Description              |
| password            | varchar   | Description              |
| salt                | varchar   | Description              |
| profilePicture      | varchar   | Description              |

<br/>

### user_wishlists Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| gameID              | integer   | Description              |

<br/>

### user_ratings Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| gameID              | integer   | Description              |
| rating              | integer   | Description              |

<br/>

### user_recommendations Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| gameID              | integer   | Description              |

<br/>

### user_friends Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| friendID            | integer   | Description              |

<br/>

### user_ignore Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| gameID              | integer   | Description              |

<br/>

### user_messages Table
| Column              | Data Type | Description              |
|---------------------|-----------|--------------------------|
| userID              | integer   | Description              |
| messageID           | SERIAL    | Description              |
| title               | varchar   | Description              |
| message             | varchar   | Description              |

<br/>

## Breakdown of Labor

### Emily Michaud - emichaud998
* 

### Nicholas Michaud - namichaud
* 

### Timothy Shee - Borghese-Gladiator
* 