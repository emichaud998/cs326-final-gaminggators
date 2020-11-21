'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, applySelectedFilters} from './filtering.js';
import {sortTitle, sortPopularity, sortReleaseDate} from './sorting.js';
import {clickStar, ratingSubmit, wishlistAdd, removeRecommendation, checkRenderEmpty, fetchGameListInfo, fetchUserRating, fetchGameFilterList} from './helpers.js';

window.addEventListener('load', recommendationsStart);

async function recommendationsStart() {
    window.filters = [];
    sortPopularity(false);
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(false, false, false, null);
    await renderRecommendationsList();
}

async function renderRecommendationsList() {
    const recommendation_games = await fetchGameListInfo('/user/recommendations');
    if (recommendation_games.length !== 0) {
        addGameCards(recommendation_games, null);
    }
    else
    {
        const gameCardsDiv = document.getElementById('gameCards');
        gameCardsDiv.innerHTML= '';
        gameCardsDiv.classList.add('container', 'mt-n5');

        checkRenderEmpty(gameCardsDiv, 'Rate some games and we will give you recommendations!', 'https://cdna.artstation.com/p/assets/images/images/028/102/058/original/pixel-jeff-matrix-s.gif?1593487263');
    }
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
    
    document.getElementById('sort_title_ascend').addEventListener('click', async () => {
        await sortTitle(true);
        addGameCards(null, null);
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

async function addGameCards(gameList, user_ratings) {
    const gameCardsDiv = document.getElementById('gameCards');
    gameCardsDiv.innerHTML= '';
    gameCardsDiv.classList.add('container', 'mt-n5');

    if (window.filters.length !== 0) {
        const filters = applySelectedFilters(window.filters, 'user_recommendations');
        gameList = await fetchGameFilterList('/game/list/filter/custom' , filters); 
    } else if (gameList === null){
        gameList =  await fetchGameListInfo('/user/recommendations');
    }

    if (gameList.length <= 0) {
        checkRenderEmpty(gameCardsDiv, 'We could not find any recommendations that match that filter!', 'https://cdna.artstation.com/p/assets/images/images/028/102/058/original/pixel-jeff-matrix-s.gif?1593487263');
        return;
    }

    if (user_ratings === null) {
        user_ratings = await fetchUserRating();
    }

    for (let i = 0; i < gameList.length; i++) {
        // Create main card divs
        const mainCardDiv = document.createElement('div');
        mainCardDiv.classList.add('card', 'mb-3');
        mainCardDiv.id = gameList[i].id;
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('row');
        
        // Create div column for game image
        const cardImageColumnDiv = document.createElement('div');
        cardImageColumnDiv.classList.add('cardImageDiv', 'col-md-3', 'p-0', 'd-flex', 'align-items-center', 'justify-content-center');
        const pictureLink = document.createElement('a');
        const hrefLink = "game_overlay.html?gameID="+ gameList[i].id;
        pictureLink.href = hrefLink;
        const image = document.createElement('img');
        image.classList.add('card-img');
        if (gameList[i].cover !== null) {
            const imageFilePath = '../images/' + gameList[i].cover;
            image.src = imageFilePath;
        }
        pictureLink.appendChild(image);
        cardImageColumnDiv.appendChild(pictureLink);
        cardRowDiv.appendChild(cardImageColumnDiv);
        
        // Create divs for card body
        const cardBodyColumnDiv = document.createElement('div');
        cardBodyColumnDiv.classList.add('col-md-7', 'p-0');
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');
        
        // Create card game title
        const titleLink = document.createElement('a');
        titleLink.href = hrefLink;
        const cardTitle = document.createElement('h4');
        cardTitle.classList.add('card-title');
        const title = document.createTextNode(gameList[i].name);
        cardTitle.appendChild(title);
        titleLink.appendChild(cardTitle);
        cardBodyDiv.appendChild(titleLink);
        
        // Create card game description 
        const gameDescription = document.createElement('p');
        gameDescription.classList.add('card-text');
        const descriptionText = gameList[i].description;
        let truncatedText;
        if (descriptionText !== null) {
            if (descriptionText.split(' ').length > 200) {
                truncatedText = descriptionText.split(' ').splice(0, 200).join(' ');
                truncatedText = truncatedText + '...';
            } else {
                truncatedText = descriptionText;
            }
        } else {
            truncatedText = '';
        }
        const description = document.createTextNode(truncatedText);
        document.createTextNode(gameList[i].description);
        gameDescription.appendChild(description);
        cardBodyDiv.appendChild(gameDescription);
        const bodyBR = document.createElement('br');
        cardBodyDiv.appendChild(bodyBR);

        // Create card game rating div and rating label
        const ratingsDiv = document.createElement('div');
        ratingsDiv.classList.add('ratingLine', 'd-flex', 'flex-row', 'flex-wrap');
        const ratingLabel = document.createElement('p');
        ratingLabel.classList.add('mr-3');
        const textRatingLabel = document.createTextNode('Your Rating: ');
        ratingLabel.appendChild(textRatingLabel);
        ratingsDiv.appendChild(ratingLabel);

        let goldStarNum = 0;
        const ratingObj = user_ratings.find(rating => {
            return parseInt(rating.gameid) === parseInt(mainCardDiv.id);
        });
        if (ratingObj) {
            goldStarNum = ratingObj.rating;
        }

        // Create card game rating stars
        for (let starCount = 1; starCount <= 5; starCount++){
            const starDiv = document.createElement('div');
            starDiv.classList.add('fa', 'fa-star', 'mt-1');
            if (goldStarNum > 0) {
                starDiv.style.color = 'gold';
                goldStarNum--;
            }
            starDiv.addEventListener('click', () => {clickStar(starDiv, ratingsDiv, starCount);});
            ratingsDiv.appendChild(starDiv);
        }

        // Create card game rating submit button and add ratings div to card body div
        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-3', 'mr-3', 'h-25', 'p-n2', 'mt-n1');
        submitButton.innerText='Submit';
        submitButton.addEventListener('click', () => {ratingSubmit(ratingsDiv, mainCardDiv.id);});
        ratingsDiv.appendChild(submitButton);
        cardBodyDiv.appendChild(ratingsDiv);

        // Add card body div to outer card row div
        cardBodyColumnDiv.appendChild(cardBodyDiv);
        cardRowDiv.appendChild(cardBodyColumnDiv);

        // Create divs for add to wishlist/not interested buttons and match accuracy text
        const cardButtonsColumnDiv = document.createElement('div');
        cardButtonsColumnDiv.classList.add('wishlistButtons', 'col-md-2', 'd-flex', 'align-items-center', 'justify-content-center');
        const buttonDiv = document.createElement('div'); 
        
        /*
        // Create match accuracy text
        const matchP = document.createElement('p');
        matchP.classList.add('smaller_font');
        const matchPercentage = document.createTextNode('Match Accuracy: 80%');
        matchP.appendChild(matchPercentage);
        buttonDiv.appendChild(matchP);*/

        // Create add to wishlist button
        const wishlistButton = document.createElement('button');
        wishlistButton.classList.add('btn', 'btn-success');
        wishlistButton.innerText='Add to wishlist';
        wishlistButton.addEventListener('click', async () => {
            await wishlistAdd(mainCardDiv.id)
            .then(await removeRecommendation(mainCardDiv.id, gameCardsDiv));
        });
        
        // Create not interested button
        const removeRecommendationButton = document.createElement('button');
        removeRecommendationButton.classList.add('btn','btn-danger', 'mt-3');
        removeRecommendationButton.innerText='Not interested';
        removeRecommendationButton.addEventListener('click', async () => {
            await removeRecommendation(mainCardDiv.id, gameCardsDiv);
        });
        
        // Add buttons with space between them to outer button div
        buttonDiv.appendChild(wishlistButton); 
        const buttonBR = document.createElement('br');
        buttonDiv.appendChild(buttonBR);
        buttonDiv.appendChild(removeRecommendationButton);

        // Add button div to outer column div, then add to outer row div for card
        cardButtonsColumnDiv.appendChild(buttonDiv);
        cardRowDiv.appendChild(cardButtonsColumnDiv);
        
        // Add card row div to main card div and add card div to container of cards
        mainCardDiv.appendChild(cardRowDiv);
        gameCardsDiv.appendChild(mainCardDiv);
    }
}
