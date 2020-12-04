'use strict';

import {clickStar, ratingSubmit, wishlistAdd} from './helpers.js';

window.addEventListener('load', game_overlay_Start);

async function game_overlay_Start() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameID = parseInt(urlParams.get('gameID'));
    const response = await fetch('/user/ratings');
    if (response.ok) {
        const user_ratings = await response.json();
        const gameResponse = await fetch('/games/singleGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'gameID':gameID})
        });
        if (gameResponse.ok) {
            await gameResponse.json()
            .then(gameInfo => renderGame(gameInfo, user_ratings));
        }
    }
}

function renderGame(gameInfo, user_ratings) {
    const gameCard = document.getElementById('game_card');
    // Create card image
    const image = document.createElement('img');
    image.classList.add('gameCoverImage');
    image.alt = "Game cover picture";
    if (gameInfo.cover !== null) {
        const imageFilePath = '../images/' + gameInfo.cover;
        image.src = imageFilePath;
    } 
    gameCard.appendChild(image);
    // Create div for game card body
    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = gameInfo.name;
    cardBodyDiv.appendChild(cardTitle);
    
    const companyDiv = document.createElement('div');
    companyDiv.classList.add('company');
    const companyTitle = document.createElement('h6');
    if (gameInfo.developer !== null) {
        companyTitle.innerText = JSON.parse(gameInfo.developer)[0];
    }
    companyDiv.appendChild(companyTitle);
    cardBodyDiv.appendChild(companyDiv);

    const release_dateDiv = document.createElement('div');
    release_dateDiv.classList.add('ReleaseDate');
    const releaseDateTitle = document.createElement('h6');
    const release_date = new Date(gameInfo.release_date);
    releaseDateTitle.innerText = release_date.toDateString();
    release_dateDiv.appendChild(releaseDateTitle);
    cardBodyDiv.appendChild(release_dateDiv);
    gameCard.appendChild(cardBodyDiv);

    // Create ratings div and insert rating label
    const ratingsDiv = document.createElement('div');
    ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap', 'ml-3');
    const ratingLabel = document.createElement('p');
    ratingLabel.classList.add('mr-3', 'mt-n1');
    const textRatingLabel = document.createTextNode('Your Rating: ');
    ratingLabel.appendChild(textRatingLabel);
    ratingsDiv.appendChild(ratingLabel);

    let goldStarNum = 0;
    const ratingObj = user_ratings.find(rating => {
        return parseInt(rating.gameid) === parseInt(gameInfo.id);
    });
    if (ratingObj) {
        goldStarNum = ratingObj.rating;
    }
    // Create card game rating stars
    for (let starCount = 1; starCount <= 5; starCount++){
        const starDiv = document.createElement('div');
        starDiv.classList.add('fa', 'fa-star');
        if (goldStarNum > 0) {
            starDiv.style.color = 'gold';
            goldStarNum--;
        }
        starDiv.addEventListener('click', () => {clickStar(starDiv, ratingsDiv, starCount);});
        ratingsDiv.appendChild(starDiv);
    }

    // Create card game rating submit button and add ratings div to card body div
    const submitButton = document.createElement('button');
    submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-2', 'h-25', 'mt-n1');
    submitButton.innerText='Submit';
    submitButton.addEventListener('click', () => {ratingSubmit(ratingsDiv, gameInfo.id);});
    ratingsDiv.appendChild(submitButton);
    gameCard.appendChild(ratingsDiv);

    // Create add to wishlist button
    const wishlistDiv = document.createElement('div');
    wishlistDiv.classList.add('text-center', 'h-25', 'mb-3');
    const wishlistButton = document.createElement('button');
    wishlistButton.classList.add('btn', 'btn-sm', 'btn-success');
    wishlistButton.innerText='Add to Wishlist';
    wishlistButton.addEventListener('click', () => {wishlistAdd(gameInfo.id);});
    wishlistDiv.appendChild(wishlistButton);

    gameCard.appendChild(wishlistDiv);

    if (gameInfo.genre !== null) {
        const genreDiv = document.getElementById('genre');
        genreDiv.innerHTML = JSON.parse(gameInfo.genre).join(', ');
    }

    if (gameInfo.platform !== null) {
        const platformDiv = document.getElementById('platform');
        platformDiv.innerHTML = JSON.parse(gameInfo.platform).join(', ');
    }

    if (gameInfo.developer !== null) {
        const developerDiv = document.getElementById('developers');
        developerDiv.innerHTML = JSON.parse(gameInfo.developer).join(', ');
    }

    if (gameInfo.publisher !== null) {
        const publisherDiv = document.getElementById('publishers');
        publisherDiv.innerHTML = JSON.parse(gameInfo.publisher).join(', ');
    }

    if (gameInfo.description !== null) {
        const descriptionDiv = document.getElementById('description');
        descriptionDiv.innerHTML = gameInfo.description;
    }

    if (gameInfo.game_modes !== null) {
        const gameModeDiv = document.getElementById('game_modes');
        gameModeDiv.innerHTML = JSON.parse(gameInfo.game_modes).join(', ');
    }

    if (gameInfo.themes !== null) {
        const themeDiv = document.getElementById('theme');
        themeDiv.innerHTML = JSON.parse(gameInfo.themes).join(', ');
    }

    if (gameInfo.series !== null) {
        const seriesDiv = document.getElementById('series');
        seriesDiv.innerHTML = gameInfo.series;
    }

    if (gameInfo.franchise !== null) {
        const franchiseDiv = document.getElementById('franchise');
        franchiseDiv.innerHTML = JSON.parse(gameInfo.franchise).join(', ');
    }

    if (gameInfo.player_perspectives !== null) {
        const player_perspectiveDiv = document.getElementById('player_perspective');
        player_perspectiveDiv.innerHTML = JSON.parse(gameInfo.player_perspectives).join(', ');
    }

    if (gameInfo.screenshots !== null) {
        const screenshotDiv = document.getElementById('screenshots');
        const screenshots = JSON.parse(gameInfo.screenshots);

        for (const screenshot of screenshots) {
            const screenshotCard = document.createElement('div');
            screenshotCard.classList.add('image_card');
            const picture = document.createElement('img');
            picture.classList.add('image_scroll');
            picture.alt = "Game screenshot";
            if (screenshot !== null) {
                picture.src = 'https://' + screenshot;
            }
            screenshotCard.appendChild(picture);
            screenshotDiv.appendChild(screenshotCard);
        }
    }

}