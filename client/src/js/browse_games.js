'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, gameSearch, applySelectedFilters} from './filtering.js';
import {sortTitle, sortPopularity, sortReleaseDate} from './sorting.js';
import {clickStar, ratingSubmit, wishlistAdd, fetchGameList, fetchUserRating, fetchGameFilterList} from './helpers.js';

window.addEventListener('load', browseGamesStart);

async function browseGamesStart() {
    window.filters = [];
    sortPopularity(false);
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(true, false, '/games/allTitles');
    await addGameCards(null, null);
}

function addEventListeners() {
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

    document.getElementById('all_filter_apply').addEventListener('click', async () => {
        addGameCards(null, null);
    });
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    document.getElementById('gameSearchButton').addEventListener('click', async () => {
        await gameSearch('allGames')
        .then((searchResults) => {addGameCards(searchResults.gameList, searchResults.ratings);});
    });

    document.getElementById('gameSearchRemoveButton').addEventListener('click', async () => {await addGameCards(null, null);});

    document.getElementById('sort_title_ascend').addEventListener('click', async () => {
        await sortTitle(true);
        addGameCards(null,  null);
    });
    document.getElementById('sort_title_descend').addEventListener('click', async () => {
        await sortTitle(false);
        addGameCards(null, null);

    });
    document.getElementById('sort_popularity_ascend').addEventListener('click', async () => {
        await sortPopularity(true);
        addGameCards(null, null);
    });
    document.getElementById('sort_popularity_descend').addEventListener('click', async () => {
        await sortPopularity(false);
        addGameCards(null, null);
    });
    document.getElementById('sort_release_date_ascend').addEventListener('click', async () => {
        await sortReleaseDate(true);
        addGameCards(null, null);
    });
    document.getElementById('sort_release_date_descend').addEventListener('click', async () => {
        await sortReleaseDate(false);
        addGameCards(null, null);
    });
}

// Add game cards to main body container of the page
async function addGameCards(games, ratings) {
    let gameList = games;
    let user_ratings = ratings;
    const gameCardsDiv = document.getElementById('gameCards');

    if (window.filters.length !== 0) {
        const filters = applySelectedFilters(window.filters);
        gameList = await fetchGameFilterList('/game/list/filter/all' , filters); 
    } else if (gameList === null){
        gameList = await fetchGameList();
    }

    if (user_ratings === null) {
        user_ratings = await fetchUserRating();
    }

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
            if (gameList[counter].cover !== null) {
                //image.src = 'https://' + gameList[counter].cover;
            }
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
            const descriptionText = gameList[counter].description;
            let truncatedText = descriptionText.split(" ").splice(0,100).join(" ");
            truncatedText = truncatedText + '...';
            const description = document.createTextNode(truncatedText);
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
