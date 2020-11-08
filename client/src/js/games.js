'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters} from './filtering.js';
import {sortTitle, sortRating, sortReleaseDate, sortDefault} from './sorting.js';
//import {clickStar, ratingSubmit} from './rating.js';

window.addEventListener('load', gamesStart);
//const url = 'http://localhost:8080';
//const userID = '1111';

async function gamesStart() {
    window.filters = [];
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(true, 'POST', '/user/ratings/allTitles');
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
    /*
    const gameCardsDiv = document.getElementById('gameCards');
    const response = await fetch(url+'/user/ratings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    });
    const user_ratings = await response.json();
    await fetch(url+'/games/allGames')
    .then(response => response.json())
    .then(data => addGameCards(data, gameCardsDiv, user_ratings));*/
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
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    //document.getElementById('gameSearchBar').addEventListener('click', gameSearch);
    document.getElementById('sort_title_ascend').addEventListener('click', () => {sortTitle(true);});
    document.getElementById('sort_title_descend').addEventListener('click', () => {sortTitle(false);});
    document.getElementById('sort_rating_ascend').addEventListener('click', () => {sortRating(true);});
    document.getElementById('sort_rating_descend').addEventListener('click', () => {sortRating(false);});
    document.getElementById('sort_release_date_ascend').addEventListener('click', () => {sortReleaseDate(true);});
    document.getElementById('sort_release_date_descend').addEventListener('click', () => {sortReleaseDate(false);});
    document.getElementById('clear_sort').addEventListener('click', () => {sortDefault();});
}

function addGameCards(gameCardsDiv) {
    // First for loop is the number of rows of cards, second for loop creates 3 cards per row
    for (let i = 0; i < 6; i++) {
        // Create card div for row
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
        for (let i = 0; i < 4; i++) {
            // Create main card div per card
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            // Create div for game card image
            const pictureLink = document.createElement('a');
            pictureLink.href = 'game_overlay.html';
            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = 'https://www.mobygames.com/images/covers/l/55423-kirby-the-amazing-mirror-game-boy-advance-front-cover.jpg';
            pictureLink.appendChild(image);
            cardDiv.appendChild(pictureLink);
            
            // Create div for game card body
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');

            // Add game title to game card body
            const titleLink = document.createElement('a');
            titleLink.href = 'game_overlay.html';
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            const title = document.createTextNode('Kirby & the Amazing Mirror');
            cardTitle.appendChild(title);
            titleLink.appendChild(cardTitle);
            cardBodyDiv.appendChild(titleLink);

            // Create ratings div and insert rating label
            const ratingsDiv = document.createElement('div');
            ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap');
            const ratingLabel = document.createElement('p');
            ratingLabel.classList.add('mr-3');
            const textRatingLabel = document.createTextNode('Your Rating: ');
            ratingLabel.appendChild(textRatingLabel);
            ratingsDiv.appendChild(ratingLabel);

            // Create card game rating stars
            for (let starCount = 0; starCount < 5; starCount++){
                const starDiv = document.createElement('div');
                starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
                ratingsDiv.appendChild(starDiv);
            }
            cardBodyDiv.appendChild(ratingsDiv);

            // Add single card div to row of cards
            cardDiv.appendChild(cardBodyDiv);
            cardRowDiv.appendChild(cardDiv);
        }
        // Add rows of game cards to container of game card rows
        gameCardsDiv.appendChild(cardRowDiv);
    }
}
