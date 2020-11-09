'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, gameSearch, applySelectedFilters} from './filtering.js';
import {sortTitle, sortRating, sortReleaseDate, sortDefault} from './sorting.js';
import {clickStar, ratingSubmit, wishlistAdd} from './rating.js';

window.addEventListener('load', browseGamesStart);
const url = 'https://gamer-port.herokuapp.com';
const userID = '1111';

async function browseGamesStart() {
    window.filters = [];
    filterSideBarSetup();
    autocompleteSetup(true, false, 'GET', '/games/allTitles');
    const gameCardsDiv = document.getElementById('gameCards');
    const response = await fetch(url+'/user/ratings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    });
    const user_ratings = await response.json();
    const gameResponse = await fetch(url+'/games/allGames');
    if (gameResponse) {
        const gameList = await gameResponse.json();
        if (gameList) {
            addEventListeners(gameList);
            document.getElementById('Genre_button').click();
            addGameCards(gameList, gameCardsDiv, user_ratings);
        }
    }
}

function addEventListeners(gameList) {
    //execute a function when someone clicks in the document
    document.addEventListener("click", function (e) {closeAllLists(e.target);});
    
    const filterTabs = document.getElementsByClassName('tablinks');
    for (const tab of filterTabs) {
        const tabId = tab.id;
        const tabSubstring = tabId.substring(0, tabId.indexOf('_'));
        tab.addEventListener('click', () => {openFilterTab(tab, tabSubstring);});
    }
    const ratingRadioButtons = document.getElementsByName('choice-rating_filter');
    for (const button of ratingRadioButtons) {
        button.addEventListener('click', showRatingFilter);
    }
    document.getElementById('all_filter_apply').addEventListener('click', () => {applySelectedFilters(window.filters);});
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    document.getElementById('gameSearchButton').addEventListener('click', async () => {
        await gameSearch()
        .then((searchResults) => {addGameCards(searchResults.gameList,  document.getElementById('gameCards'), searchResults.ratings);});
    });

    document.getElementById('gameSearchRemoveButton').addEventListener('click', async () => {
        const response = await fetch(url+'/user/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'userID':userID})
        });
        await response.json()
        .then((ratings) => {addGameCards(gameList,  document.getElementById('gameCards'), ratings);});
    });

    document.getElementById('sort_title_ascend').addEventListener('click', () => {sortTitle(true);});
    document.getElementById('sort_title_descend').addEventListener('click', () => {sortTitle(false);});
    document.getElementById('sort_rating_ascend').addEventListener('click', () => {sortRating(true);});
    document.getElementById('sort_rating_descend').addEventListener('click', () => {sortRating(false);});
    document.getElementById('sort_release_date_ascend').addEventListener('click', () => {sortReleaseDate(true);});
    document.getElementById('sort_release_date_descend').addEventListener('click', () => {sortReleaseDate(false);});
    document.getElementById('clear_sort').addEventListener('click', () => {sortDefault();});
}

// Add game cards to main body container of the page
function addGameCards(gameList, gameCardsDiv, user_ratings) {
    document.getElementById('title-search').value = '';
    gameCardsDiv.innerHTML= '';
    gameCardsDiv.classList.add('container', 'ml-4', 'mt-4');
    const outerIndex = Math.ceil(gameList.length/3);
    // First for loop is the number of rows of cards, second for loop creates 3 cards per row
    let counter = 0;
    for (let j = 0; j < outerIndex; j++) {
        // Create card div for row
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
        for (let i = 0; i < 3; i++) {
            if (gameList[counter] === undefined) {
                break;
            }
            // Create main card div per card
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.id = gameList[counter].id;

            // Create div for game card image
            const pictureLink = document.createElement('a');
            const hrefLink = "game_overlay.html?gameID="+ gameList[counter].id;
            pictureLink.href = hrefLink;
            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = gameList[counter].cover;
            pictureLink.appendChild(image);
            cardDiv.appendChild(pictureLink);
            
            // Create div for game card body
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');

            // Add game title to game card body
            const titleLink = document.createElement('a');
            titleLink.href = hrefLink;
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            const title = document.createTextNode(gameList[counter].name);
            cardTitle.appendChild(title);
            titleLink.appendChild(cardTitle);
            cardBodyDiv.appendChild(titleLink);
            
            // Add description to game card body
            const gameDescription = document.createElement('p');
            gameDescription.classList.add('card-text');
            const description = document.createTextNode(gameList[counter].description);
            gameDescription.appendChild(description);
            cardBodyDiv.appendChild(gameDescription);

            // Create div to put rating and wishlist buttons at bottom of card
            const bottomCard = document.createElement('div');
            bottomCard.classList.add('bottomGameCard', 'mb-1');

            // Create ratings div and insert rating label
            const ratingsDiv = document.createElement('div');
            ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap');
            const ratingLabel = document.createElement('p');
            ratingLabel.classList.add('mr-3');
            const textRatingLabel = document.createTextNode('Your Rating: ');
            ratingLabel.appendChild(textRatingLabel);
            ratingsDiv.appendChild(ratingLabel);

            let goldStarNum = 0;
            const ratingObj = user_ratings.find(rating => {
                return rating.gameID === cardDiv.id;
            });
            if (ratingObj) {
                goldStarNum = ratingObj.rating;
            }
            // Create card game rating stars
            for (let starCount = 1; starCount <= 5; starCount++){
                const starDiv = document.createElement('div');
                starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
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
            submitButton.addEventListener('click', () => {ratingSubmit(ratingsDiv, cardDiv.id);});
            ratingsDiv.appendChild(submitButton);
            bottomCard.appendChild(ratingsDiv);

            // Create add to wishlist button
            const wishlistDiv = document.createElement('div');
            wishlistDiv.classList.add('text-center', 'h-25');
            const wishlistButton = document.createElement('button');
            wishlistButton.classList.add('btn', 'btn-sm', 'btn-success');
            wishlistButton.innerText='Add to Wishlist';
            wishlistButton.addEventListener('click', () => {wishlistAdd(cardDiv.id);});
            wishlistDiv.appendChild(wishlistButton);
            bottomCard.appendChild(wishlistDiv);

            cardBodyDiv.appendChild(bottomCard);

            // Add single card div to row of cards
            cardDiv.appendChild(cardBodyDiv);
            cardRowDiv.appendChild(cardDiv);

            counter++;
        }
        // Add rows of game cards to container of game card rows
        gameCardsDiv.appendChild(cardRowDiv);
    }
}
