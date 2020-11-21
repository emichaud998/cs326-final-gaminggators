'use strict';

let db;

function databaseConnectionSetup() {

    const pgp = require("pg-promise")({
        connect(client) {
            console.log('Connected to database:', client.connectionParameters.database);
        },
    
        disconnect(client) {
            console.log('Disconnected from database:', client.connectionParameters.database);
        }
    });

    // Local PostgreSQL credentials
    let username;
    let password;
    let dbname;
    if (!process.env.DATABASE_URL) {
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
    }


    const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/${dbname}`;
    db = pgp(url);
}

async function connectAndRun(task) {
    let connection = null;
    try {
        connection = await db.connect();
        return await task(connection);
    } finally {
        connection.done();
    }
}

async function findMatchingEmail(email)
{
    return await connectAndRun(db => db.oneOrNone('SELECT email FROM users WHERE email = $1', [email])).then(function(result) {
        return result;
    });

}

async function insertIntoUsers(username, email, hash, salt)
{
    return await connectAndRun(db => db.none('INSERT INTO users (username, email, password, salt, profilePicture) VALUES ($1, $2, $3, $4, $5)', [username, email, hash, salt, '../images/blankprofile.png'])).then(function(result) {
        return result;
    });
}

async function execOne(selectElems, tableName, whereElems, values) 
{
    return await connectAndRun(db => db.one(`SELECT ${selectElems} FROM ${tableName} WHERE ${whereElems}`, values)).then(function(result) {
        return result;
    });
}

async function execOneOrNone(selectElems, tableName, whereElems, values) 
{
    return await connectAndRun(db => db.oneOrNone(`SELECT ${selectElems} FROM ${tableName} WHERE ${whereElems}`, values)).then(function(result) {
        return result;
    });
}

async function execAny(selectElems, tableName, whereElems, values)
{
    return await connectAndRun(db => db.any(`SELECT ${selectElems} FROM ${tableName} WHERE ${whereElems}`, values)).then(function(result) {
        return result;
    });
}

async function insertInto(tableName, valuesPH, values)
{
    return await connectAndRun(db => db.none(`INSERT INTO ${tableName} VALUES ${valuesPH}`, values)).then(function(result) {
        return result;
    });
}

async function removeFrom(tableName, whereElems, values)
{
    return await connectAndRun(db => db.none(`DELETE FROM ${tableName} WHERE ${whereElems}`, values)).then(function(result) {
        return result;
    });
}

async function removeAll(tableName)
{
    return await connectAndRun(db => db.none(`DELETE FROM ${tableName}`)).then(function(result) {
        return result;
    });
}

async function updateAt(tableName, setElems, whereElems, values)
{
    return await connectAndRun(db => db.none(`UPDATE ${tableName} SET ${setElems} WHERE ${whereElems}`, values)).then(function(result) {
        return result;
    });
}

async function joinRatedGames(userID)
{
    return await connectAndRun(db => db.any(`SELECT userID, gameID, rating, genre, themes FROM user_ratings, games WHERE user_ratings.gameID = games.id AND userID = $1`, [userID])).then(function(result) {
        return result;
    });
}

//CREATE TABLE users (id SERIAL PRIMARY KEY, username varchar, email varchar, password varchar, salt varchar, profilePicture varchar);

exports.findMatchingEmail = findMatchingEmail;
exports.insertIntoUsers = insertIntoUsers;
exports.execOne = execOne;
exports.execOneOrNone = execOneOrNone;
exports.execAny = execAny;
exports.insertInto = insertInto;
exports.removeFrom = removeFrom;
exports.removeAll = removeAll;
exports.updateAt = updateAt;
exports.databaseConnectionSetup = databaseConnectionSetup;
exports.databaseConnectionSetup = databaseConnectionSetup;
exports.joinRatedGames = joinRatedGames;
