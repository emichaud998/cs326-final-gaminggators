const fetch = require("node-fetch");

const pgp = require("pg-promise")({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});
let client_id;
let autorization_key;
if (!process.env.CLIENTID) {
    const secrets = require('../secrets.json');
    client_id = secrets.client_id;
} else {
    client_id = process.env.PASSWORD;
}

if (!process.env.AUTORIZATIONKEY) {
    const secrets = require('../secrets.json');
    autorization_key = secrets.autorization_key;
} else {
    autorization_key = process.env.AUTORIZATIONKEY;
}

const fs = require('fs'),
    request = require('request');

async function download (uri, filename){
    request
    .get(uri)
    .on('error', function(err) {
        console.error(err);
    })
    .pipe(fs.createWriteStream(filename));
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(300);
}

// Local PostgreSQL credentials
let username;
let password;
let dbname;
const secrets = require('../secrets.json');
if (!process.env.PASSWORD) {
    password = secrets.password;
} else {
    password = process.env.PASSWORD;
}
if (!process.env.USERNAME) {
    username = secrets.username;
} else {
    username = process.env.USERNAME;
}
if (!process.env.DBNAME) {
    dbname = secrets.dbname;
} else {
    dbname = process.env.DBNAME;
}

const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/${dbname}`;
const db = pgp(url);
populateDatabase();

async function connectAndRun(task) {
    let connection = null;
    try {
        connection = await db.connect();
        return await task(connection);
    } finally {
        connection.done();
    }
}

async function populateDatabase() {
    let offset = 0;
    let offsetAdd = 0;
    while (offsetAdd >= 0) {
        offsetAdd = await fetchGames(offset); 
        offset = offset + offsetAdd;
        console.log('Progress: ' + offset + ' games fetched');
    }
    console.log("Done");
    return 0;
}

async function fetchGames(offset) {
    const raw = `query games "Game Info" {\n    fields id, name, total_rating, total_rating_count, follows, platforms.name, cover.url, involved_companies.company.name, involved_companies.publisher, involved_companies.developer, collection.name, first_release_date, category, franchises.name, game_modes.name, genres.name, screenshots.url, summary, themes.name, similar_games.name, player_perspectives.name, alternative_names.name;\n        limit 200; offset ${offset}; sort id asc;\n            where category=(0) & total_rating != null & total_rating_count != null & total_rating_count > 40 & summary != null;\n    };`;

    const requestOptions = {
    method: 'POST',
    headers: {
        'Client-ID': `${client_id}`,
        'Authorization': `${autorization_key}`,
        'Content-Type': 'text/plain'
    },
    body: raw,
    redirect: 'follow'
    };

    const response = await fetch("https://api.igdb.com/v4/multiquery", requestOptions);
    if (!response.ok) {
        if (response.status === 504) {
            console.log('504 Error: Skipping offset');
            return 100;
        }
        const err = new Error(response.statusText);
        console.log(err);
        return -1;
    }
    let games = await response.json();
    games = games[0].result;
    
    const gameList = [];
    let genreList = [];
    let platformList = [];
    let franchiseList = [];
    let gameModeList = [];
    let themeList = [];
    let player_perspectivesList = [];
    let companyList = [];
    let alternative_namesList = [];

    for (const game of games) {
        const gameObj = {};

        if (game.id !== undefined) {
            gameObj.id = game.id;
        }

        if (game.name !== undefined) {
            gameObj.name = game.name;
        }

        if (game.cover !== undefined) {
            const image = increase_cover_size(game.cover.url);
            const imageURL = 'https://' + image.toString();
            const fileName = 'game_images/' + 'game' + (game.id).toString() +'.jpg';
            console.log('Downloading Image...');
            await download(imageURL, fileName);
            gameObj.cover = fileName;
        }

        if (game.first_release_date !== undefined) {
            const release_date = convert_release_date(game.first_release_date);
            gameObj.release_date = release_date; 
        }

        const screenshots = [];
        if (game.screenshots !== undefined) {
            for (const screenshot of game.screenshots) {
                const image = increase_screenshot_size(screenshot.url);
                screenshots.push(image);
            }
            gameObj.screenshots = screenshots;
        }

        if (game.summary !== undefined) {
            gameObj.description = game.summary;
        }

        if (game.genres !== undefined) {
            const genres = convertNameArray(game.genres);
            genreList = addList(game.id, game.genres, genreList);
            gameObj.genre = genres;
        }

        if (game.platforms !== undefined) {
            const platforms = convertNameArray(game.platforms);
            platformList = addList(game.id, game.platforms, platformList);
            gameObj.platform = platforms;
        }

        if (game.franchises !== undefined) {
            const franchises = convertNameArray(game.franchises);
            gameObj.franchise = franchises;
            franchiseList = addList(game.id, game.franchises, franchiseList);
        }

        if (game.collection !== undefined) {
            gameObj.series = game.collection.name;
        }

        if (game.game_modes !== undefined) {
            const game_modes = convertNameArray(game.game_modes);
            gameObj.game_mode = game_modes;
            gameModeList = addList(game.id, game.game_modes, gameModeList);
        }

        if (game.themes !== undefined) {
            const themes = convertNameArray(game.themes);
            gameObj.themes = themes;
            themeList = addList(game.id, game.themes, themeList);
        }

        if (game.similar_games !== undefined) {
            const similar_games = convertNameArray(game.similar_games);
            gameObj.similar_games = similar_games;
        }

        if (game.player_perspectives !== undefined) {
            const player_perspectives = convertNameArray(game.player_perspectives);
            gameObj.player_perspectives = player_perspectives;
            player_perspectivesList = addList(game.id, game.player_perspectives, player_perspectivesList);
        }

        if (game.alternative_names !== undefined) {
            alternative_namesList = addList(game.id, game.alternative_names, alternative_namesList);
            const alternative_names = convertNameArray(game.alternative_names);
            gameObj.alternative_names = alternative_names;
        }

        if (game.involved_companies !== undefined) {
            const publishers = getPublishers(game.involved_companies);
            const developers = getDevelopers(game.involved_companies);
            if (publishers.length > 0) {
                gameObj.publisher = publishers;
            } 

            if (developers.length > 0) {
                gameObj.developer = developers;
            } 
            companyList = addCompanyList(game.id, game.involved_companies, companyList);
        }

        if (game.total_rating !== undefined) {
            gameObj.rating_average = game.total_rating;
        }

        if (game.total_rating_count !== undefined) {
            gameObj.rating_count = game.total_rating_count;
        }

        if (game.follows !== undefined) {
            gameObj.follows = game.follows;
        }

        gameList.push(gameObj);

    }

    await addToDatabase(gameList, genreList, platformList, franchiseList, gameModeList, themeList, player_perspectivesList, companyList, alternative_namesList);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(4000);
    if (gameList.length > 0) {
        return 200;
    } else {
        return -1;
    }
}

async function addToDatabase(gameList, genreList, platformList, franchiseList, gameModeList, themeList, player_perspectivesList, companyList, alternative_namesList) {
    for (const game of gameList) {
        if (game.release_date !== undefined) {
            await connectAndRun(db => db.none("INSERT INTO games VALUES ($1, $2, $3, $4, DATE $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);", [game.id, game.name, game.description, game.cover, game.release_date, game.follows, game.rating_count, game.rating_average, JSON.stringify(game.screenshots), JSON.stringify(game.genre), JSON.stringify(game.platform), JSON.stringify(game.publisher), JSON.stringify(game.developer), JSON.stringify(game.franchise), JSON.stringify(game.series), JSON.stringify(game.game_mode), JSON.stringify(game.themes), JSON.stringify(game.similar_games), JSON.stringify(game.player_perspectives), JSON.stringify(game.alternative_names)])); 
        } else {
            await connectAndRun(db => db.none("INSERT INTO games VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);", [game.id, game.name, game.description, game.cover, game.release_date, game.follows, game.rating_count, game.rating_average, JSON.stringify(game.screenshots), JSON.stringify(game.genre), JSON.stringify(game.platform), JSON.stringify(game.publisher), JSON.stringify(game.developer), JSON.stringify(game.franchise), JSON.stringify(game.series), JSON.stringify(game.game_mode), JSON.stringify(game.themes), JSON.stringify(game.similar_games), JSON.stringify(game.player_perspectives), JSON.stringify(game.alternative_names)])); 
        }
    }

    for (const genre of genreList) {
        await databaseAdd('genres', genre);
    }

    for (const platform of platformList) {
        await databaseAdd('platforms', platform);
    }

    for (const franchise of franchiseList) {
        await databaseAdd('franchise', franchise);
    }

    for (const game_mode of gameModeList) {
        await databaseAdd('game_modes', game_mode);
    }

    for (const theme of themeList) {
        await databaseAdd('themes', theme);
    }

    for (const player_perspective of player_perspectivesList) {
        await databaseAdd('player_perspectives', player_perspective);
    }

    for (const company of companyList) {
        await databaseAddCompany(company);
    }

    for (const alternative_names of alternative_namesList) {
        await databaseAdd('alternative_names', alternative_names);
    }

    return;
}

async function databaseAdd(tableName, elem) {
    await connectAndRun(db => db.none(`INSERT INTO ${tableName} VALUES ($1, $2);`, [elem.name, elem.gameID]));
}

async function databaseAddCompany(elem) {
    await connectAndRun(db => db.none("INSERT INTO companies VALUES ($1, $2, $3);", [elem.name, elem.type, elem.gameID]));
}

function getPublishers(companyList) {
    const publisherArr = [];
    for (const company of companyList) {
        if (company.publisher) {
            publisherArr.push(company.company.name);
        }
    }
    return publisherArr;
}

function getDevelopers(companyList) {
    const developerArr = [];
    for (const company of companyList) {
        if (company.developer) {
            developerArr.push(company.company.name);
        }
    }
    return developerArr;
}

function addList(gameID, newElems, elemList) {
    for (const elem of newElems) {
        const newObj = {'name': elem.name, 'gameID': gameID};
        elemList.push(newObj);
    }
    return elemList;
}

function addCompanyList(gameID, newCompanies, companyList) {
    for (const company of newCompanies) {
        if (company.developer) {
            const newObj = {'name': company.company.name, 'type': 'developer', 'gameID': gameID};
            companyList.push(newObj);
        } else {
            const newObj = {'name': company.company.name, 'type': 'publisher', 'gameID': gameID};
            companyList.push(newObj);
        }
    }
    return companyList;
}

function convertNameArray(arr) {
    const nameArray = [];
    for (const elem of arr) {
        nameArray.push(elem.name);
    }
    return nameArray;
}

function increase_cover_size(image) {
    image = image.substring(2);
    const regex = /thumb/;
    image = image.replace(regex, 'cover_big_2x');
    return image;
}

function increase_screenshot_size(screenshot) {
    screenshot = screenshot.substring(2);
    const regex = /thumb/;
    screenshot = screenshot.replace(regex, 'screenshot_big_2x');
    return screenshot;
}

function convert_release_date(date) {
    let d = new Date(date*1000);
    d = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    d = d.toDateString();
    return d;
}