'use strict';

import {clickStar, ratingSubmit, wishlistAdd} from './helpers.js';

window.addEventListener('load', game_overlay_Start);
const userID = '1111';

async function game_overlay_Start() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameID = urlParams.get('gameID');
    const response = await fetch('/user/ratings');
    const user_ratings = await response.json();

    await fetch('/games/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameID':gameID})
    })
    .then(response => response.json())
    .then(gameInfo => renderGame(gameInfo, user_ratings));
}

function renderGame(gameInfo, user_ratings) {
    const gameCard = document.getElementById('game_card');
    // Create card image
    const image = document.createElement('img');
    image.classList.add('gameCoverImage');
    image.alt = "Game cover picture";
    image.src = gameInfo.cover;
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
    companyTitle.innerText = gameInfo.developers[0];
    companyDiv.appendChild(companyTitle);
    cardBodyDiv.appendChild(companyDiv);

    const release_dateDiv = document.createElement('div');
    release_dateDiv.classList.add('ReleaseDate');
    const releaseDateTitle = document.createElement('h6');
    const release_date = new Date(gameInfo.releaseDate);
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
        return rating.gameID === gameInfo.id;
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

    const genreDiv = document.getElementById('genre');
    genreDiv.innerHTML = gameInfo.genre.join(', ');

    const platformDiv = document.getElementById('platform');
    platformDiv.innerHTML = gameInfo.platform.join(', ');

    const developerDiv = document.getElementById('developers');
    developerDiv.innerHTML = gameInfo.developers.join(', ');

    const publisherDiv = document.getElementById('publishers');
    publisherDiv.innerHTML = gameInfo.publishers.join(', ');

    const descriptionDiv = document.getElementById('description');
    descriptionDiv.innerHTML = gameInfo.description;

    const gameModeDiv = document.getElementById('game_modes');
    gameModeDiv.innerHTML = gameInfo.gamemodes.join(', ');

    const keywordsDiv = document.getElementById('keywords');
    keywordsDiv.innerHTML = gameInfo.keywords.join(', ');

    const screenshotDiv = document.getElementById('screenshots');
    const screenshots = gameInfo.screenshots;

    for (const screenshot of screenshots) {
        const screenshotCard = document.createElement('div');
        screenshotCard.classList.add('image_card');
        const picture = document.createElement('img');
        picture.classList.add('image_scroll');
        picture.alt = "Game screenshot";
        picture.src = screenshot;
        screenshotCard.appendChild(picture);
        screenshotDiv.appendChild(screenshotCard);
    }

}