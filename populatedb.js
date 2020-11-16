const fetch = require("node-fetch");

const pgp = require("pg-promise")({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});

// Local PostgreSQL credentials
const username = "postgres";
//const password = "";

const url = process.env.DATABASE_URL || `postgres://${username}@localhost/`;
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
    while (offset <= 10) {
        const gameList = await fetchGames(offset); 
        if (gameList.length === 0) {
            return 0;
        }
        offset = offset + 10;
    }
    return 0;
}

async function fetchGames(offset) {
    const raw = `query games "Game Info" {\n	fields id, name, platforms.name, cover.url, involved_companies.company.name, involved_companies.publisher, involved_companies.developer, collection.name, first_release_date, category, franchise.name, franchises.name, game_modes.name, genres.name, screenshots.url, summary, themes.name, similar_games.name, player_perspectives.name, alternative_names.name;\n    limit 10; offset ${offset}; sort id asc;\n    where category=(0,4);\n};`;

    const requestOptions = {
    method: 'POST',
    headers: {
        'Client-ID': 'smbljojesvyayy7dzvdlv37y1l7zov',
        'Authorization': 'Bearer mhw6nbt54w81lm5l8xbssyhmc7hzmc',
        'Content-Type': 'text/plain'
    },
    body: raw,
    redirect: 'follow'
    };

    const response = await fetch("https://api.igdb.com/v4/multiquery", requestOptions);
    let games = await response.json();
    games = games[0].result;
    const gameList = [];
    for (const game of games) {
        const gameObj = {};

        if (game.id !== undefined) {
            gameObj.id = game.id.toString();
        }

        if (game.name !== undefined) {
            gameObj.name = game.name;
        }

        if (game.cover !== undefined) {
            const image = increase_cover_size(game.cover.url);
            gameObj.cover = image;
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
            gameObj.genre = genres;
        }

        if (game.platforms !== undefined) {
            const platforms = convertNameArray(game.platforms);
            gameObj.platform = platforms;
        }

        if (game.franchises !== undefined) {
            const franchises = convertNameArray(game.franchises);
            if (game.franchise !== undefined) {
                franchises.unshift(game.franchise);
            }
            gameObj.franchise = franchises;
        }

        if (game.collection !== undefined) {
            gameObj.series = game.collection.name;
        }

        if (game.game_modes !== undefined) {
            const game_modes = convertNameArray(game.game_modes);
            gameObj.game_mode = game_modes;
        }

        if (game.category !== undefined) {
            const category = get_category(game.category);
            gameObj.category = category;
        }

        if (game.themes !== undefined) {
            const themes = convertNameArray(game.themes);
            gameObj.themes = themes;
        }

        if (game.similar_games !== undefined) {
            const similar_games = convertNameArray(game.similar_games);
            gameObj.similar_games = similar_games;
        }

        if (game.player_perspectives !== undefined) {
            const player_perspectives = convertNameArray(game.player_perspectives);
            gameObj.player_perspectives = player_perspectives;
        }

        if (game.alternative_names !== undefined) {
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
        }

        gameList.push(gameObj);

    }

    await addToDatabase(gameList);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(2000);
    return games;
}

async function addToDatabase(gameList) {
    for (const game of gameList) {
       await connectAndRun(db => db.none("INSERT INTO Games VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);", [game.id, game.name, game.category, game.description, game.cover, game.release_date, JSON.stringify(game.screenshots), JSON.stringify(game.genre), JSON.stringify(game.platform), JSON.stringify(game.publisher), JSON.stringify(game.developer), JSON.stringify(game.franchise), JSON.stringify(game.series), JSON.stringify(game.game_mode), JSON.stringify(game.themes), JSON.stringify(game.similar_games), JSON.stringify(game.player_perspectives), JSON.stringify(game.alternative_names)]));
    }
    return;
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

function get_category(num) {
    if (num === 0) {
        return 'main_game';
    } else {
        return 'standalone_expansion';
    }
}

function convert_release_date(date) {
    let d = new Date(date*1000);
    d = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    d = d.toDateString();
    return d;
}