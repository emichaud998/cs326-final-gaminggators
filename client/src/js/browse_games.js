'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, gameSearch, applySelectedFilters} from './filtering.js';
import {sortTitle, sortPopularity, sortReleaseDate} from './sorting.js';
import {clickStar, ratingSubmit, wishlistAdd, fetchGameList, fetchUserRating, fetchGameFilterList, fetchSearchFilterList} from './helpers.js';

window.addEventListener('load', browseGamesStart);

async function browseGamesStart() {
    window.search = false;
    window.filters = [];
    sortPopularity(false);
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(false, true, false, '/games/allTitles');
    await addGameCards();
}

async function addEventListeners() {
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
        addGameCards();
    });
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    document.getElementById('gameSearchButton').addEventListener('click', async () => {
        window.search = true;
        addGameCards();
    });

    document.getElementById('gameSearchRemoveButton').addEventListener('click', async () => {
        window.search = false;
        document.getElementById('title-search').value = '';
        await addGameCards();});

    document.getElementById('sort_title_ascend').addEventListener('click', async () => {
        await sortTitle(true);
        addGameCards();
    });
    document.getElementById('sort_title_descend').addEventListener('click', async () => {
        await sortTitle(false);
        addGameCards();

    });
    document.getElementById('sort_popularity_ascend').addEventListener('click', async () => {
        await sortPopularity(true);
        addGameCards();
    });
    document.getElementById('sort_popularity_descend').addEventListener('click', async () => {
        await sortPopularity(false);
        addGameCards();
    });
    document.getElementById('sort_release_date_ascend').addEventListener('click', async () => {
        await sortReleaseDate(true);
        addGameCards();
    });
    document.getElementById('sort_release_date_descend').addEventListener('click', async () => {
        await sortReleaseDate(false);
        addGameCards();
    });
}

async function addGameCards() {
    let gameList = [];
    let userRatings = [];
    if (window.search) {
        const searchResults = await gameSearch('allGames');
        gameList = searchResults.gameList;
        userRatings = searchResults.ratings;
    }
    if (window.search && window.filters.length !== 0) {
        const filters = applySelectedFilters(window.filters);
        const searchGameIDs = [];
        for (const game of gameList) {
            if (!searchGameIDs.includes(game.id)) {
                searchGameIDs.push(game.id);
            }
        }   
        gameList = await fetchSearchFilterList('/game/search/filter' , filters, searchGameIDs); 
    } else if (window.filters.length !== 0) {
        const filters = applySelectedFilters(window.filters);
        gameList = await fetchGameFilterList('/game/list/filter/all' , filters); 
    } else if (gameList.length === 0 || gameList === null){
        gameList = await fetchGameList();
    }

    if (userRatings.length === 0  || userRatings === null) {
        userRatings = await fetchUserRating();
    }
    const records_per_page = 9;
    let current_page = 1;

    const selectedPage = function () {
        const page_number = document.getElementById('page_number').getElementsByClassName('page-item');
        for (let i = 0; i < page_number.length; i++) {
            if (i === current_page - 1) {
                page_number[i].style.opacity = "1.0";
            }
            else {
                page_number[i].style.opacity = "0.5";
            }
        }
    };

    const changePage = function (page) {
        if (page < 1) {
            page = 1;
        }
        if (page > (numPages() - 1)) {
            page = numPages();
        }

        renderGameCards(page);
        selectedPage();
    };

    const pageNumbers = function () {
        const pageNumber = document.getElementById('page_number');
        pageNumber.innerHTML = "";
        for (let i = 1; i < numPages() + 1; i++) {
            const pageLI = document.createElement('li');
            pageLI.classList.add("page-item");

            const pageLink = document.createElement('a');
            pageLink.classList.add("page-link");
            pageLink.innerHTML = i;
            pageLink.onclick = (e) => {
                current_page = e.target.textContent;
                changePage(current_page);
            };
            pageLI.appendChild(pageLink);
            pageNumber.appendChild(pageLI);
        }
    };

    const numPages = function () {
        return Math.ceil(gameList.length / records_per_page);
    };
    
    // Add game cards to main body container of the page
    const renderGameCards = function (page) {
        const gameCardsDiv = document.getElementById('gameCards');
        
        gameCardsDiv.innerHTML= '';
        gameCardsDiv.classList.add('container', 'ml-4', 'mt-4');
        
        
        let counter = (page - 1) * records_per_page;

        const outerIndex = Math.ceil(gameList.length/3);
        // First for loop is the number of rows of cards, second for loop creates 3 cards per row    
        for (let j = 0; j < outerIndex && counter < (page * records_per_page) && counter < gameList.length; j++) {
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
                    const imageFilePath = '../images/' + gameList[counter].cover;
                    image.src = imageFilePath;
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
                let truncatedText;
                if (descriptionText !== null) {
                    if (descriptionText.split(' ').length > 100) {
                        truncatedText = descriptionText.split(" ").splice(0,100).join(" ");
                        truncatedText = truncatedText + '...';
                    } else {
                        truncatedText = descriptionText;
                    }
                } else {
                    truncatedText = '';
                }
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
                const ratingObj = userRatings.find(rating => {
                    return parseInt(rating.gameid) === parseInt(cardDiv.id);
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
    };

    changePage(1);
    pageNumbers();
    selectedPage();
}

