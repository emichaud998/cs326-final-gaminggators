'use strict';
import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFileSync, readFileSync, existsSync} from 'fs';

const server = createServer(serverFunc);
const scoreFile = 'ScoreFile.json';
let scoreJSON = {};
scoreJSON.wordScoreArray = [];
scoreJSON.gameScoreArray = [];

// Check if scoreFile exists, and if it does, add contents to scoreJSON
if (existsSync(scoreFile)) {
    scoreJSON = JSON.parse(readFileSync(scoreFile));
}

// Function that processes server requests to handle word score and game score endpoints
function process(request, response, options) {
    const parsed = parse(request.url, true);
    if (parsed.pathname === "/wordScore") {
        const wordScore = {};
		if (options.name !== undefined && options.word !== undefined && options.score !== undefined) {
            wordScore.name = options.name;
            wordScore.word = options.word;
            wordScore.score = parseInt(options.score);
            scoreJSON.wordScoreArray.push(wordScore);
            scoreJSON.wordScoreArray.sort(sortArray);
            try {
                writeFileSync(scoreFile, JSON.stringify(scoreJSON));
            } catch (err){
                const headerText = {"Content-Type" : "text/json"};
                response.writeHead(500, headerText);
                response.write(JSON.stringify(err));
                response.end();
                return;
            }
            response.writeHead(200);
        }
    } else if (parsed.pathname === "/highestWordScores") {
        const headerText = {"Content-Type" : "text/json"};
        response.writeHead(200, headerText);
        const highestWordScores = [];
        for (let i = 0; i < 10; i++) {
            if (i >= scoreJSON.wordScoreArray.length) {
                break;
            }
            highestWordScores.push(scoreJSON.wordScoreArray[i]);
        }
		response.write(JSON.stringify(highestWordScores));
    } else if (parsed.pathname === "/gameScore") {
        const gameScore = {};
		if (options.name !== undefined && options.score !== undefined) {
            gameScore.name = options.name;
            gameScore.score = parseInt(options.score);
            scoreJSON.gameScoreArray.push(gameScore);
            scoreJSON.gameScoreArray.sort(sortArray);
            try {
                writeFileSync(scoreFile, JSON.stringify(scoreJSON));
            }
            catch (err) {
                const headerText = {"Content-Type" : "text/json"};
                response.writeHead(500, headerText);
                response.write(JSON.stringify(err));
                response.end();
                return;   
            }
            response.writeHead(200);
		}
	} else if (parsed.pathname === "/highestGameScores") {
        const headerText = {"Content-Type" : "text/json"};
        response.writeHead(200, headerText);
        const highestGameScores = [];
        for (let i = 0; i < 10; i++) {
            if (i >= scoreJSON.gameScoreArray.length) {
                break;
            }
            highestGameScores.push(scoreJSON.gameScoreArray[i]);
        }
		response.write(JSON.stringify(highestGameScores));
    } else {
        // If the client did not request an API endpoint, we assume we need to fetch and serve a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        let path = '';
        if (filename.endsWith("html")) {
            path = join("client/src/html/", filename);
        } else if (filename.endsWith("css")) {
            path = join("client/src/css/", filename);
        } else if (filename.endsWith("js")) {
            path = join("client/src/js/", filename);
        } else if (filename.endsWith("png") || filename.endsWith("jpeg") || filename.endsWith("jpg")) {
            path = join("client/src/images/", filename);
        }
        console.log(filename);
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                response.writeHead(200, {"Content-Type" : "text/html"});
            }
            else if (filename.endsWith("js")) {
                response.writeHead(200, {"Content-Type" : "text/javascript"});
            }
            else if (filename.endsWith("css")) {
                response.writeHead(200, {"Content-Type" : "text/css"});
            } 
            else if (filename.endsWith("png")) {
                response.writeHead(200, {"Content-Type" : "image/png"});
            } 
            else if (filename.endsWith("jpeg") || filename.endsWith("jpg")) {
                response.writeHead(200, {"Content-Type" : "image/jpeg"});
            }

            response.write(readFileSync(path));
            response.end();
        } else {
            response.writeHead(404);
            response.end();
        }
    }
}

// Function to be passed into server that handles GET and POST requests
function serverFunc (req, res) {
    if (req.method === 'GET') {
        const options = parse(req.url, true).query;
        process(req, res, options);
    } else {
        let body = '';
        req.on('data', function (data) {
        body += data;
        });
        req.on('end', function () {
        const options = JSON.parse(body);
        process(req, res, options);
        });
    }
}
server.listen(8080);
