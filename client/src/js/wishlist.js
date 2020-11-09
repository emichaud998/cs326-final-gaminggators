'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters} from './filtering.js';
import {sortTitle, sortRating, sortReleaseDate, sortDefault} from './sorting.js';

const url = 'http://localhost:8080';
const userID = '1111';

window.addEventListener('load', wishlistStart);

async function wishlistStart() {

    window.filters = [];
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(false, false, null, null);

    const wishlistResponse = await fetch(url+'/user/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    })
    await  wishlistResponse.json()
    .then(wishlist => renderWishlist(wishlist));
}

async function renderWishlist(wishlist) {
    const gameCardsDiv = document.getElementById('gameCards');
    
    if(wishlist.length ===0)
    {
        
        const emptyWishlistDiv = document.createElement('div');
        emptyWishlistDiv.classList.add('emptydiv', 'bottomDiv');
        const emptyWishlistTextNode = document.createTextNode('Add some games to your wishlist and you will see them here!');
        emptyWishlistDiv.appendChild(emptyWishlistTextNode);

        document.getElementById('emptywishlist').appendChild(emptyWishlistDiv);
        return;
    }

    const wishlistGamesResponse = await fetch(url+'/games/list/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameList':wishlist})
    });
    await wishlistGamesResponse.json()
    .then(function(wishlist_games) {addGameCards(wishlist_games, gameCardsDiv)});
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

function addGameCards(wishlistGames, gameCardsDiv) {

    for (let i = 0; i < wishlistGames.length; i++) {
        // Create main card divs
        const mainCardDiv = document.createElement('div');
        mainCardDiv.classList.add('card', 'cardRow', 'mb-3', 'bottomDiv');
        mainCardDiv.id = wishlistGames[i].id;
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('row');
        
        // Create div column for game image
        const cardImageColumnDiv = document.createElement('div');
        cardImageColumnDiv.classList.add('col-md-3', 'p-0', 'd-flex', 'align-items-center', 'justify-content-center');
        const pictureLink = document.createElement('a');
        pictureLink.href = 'game_overlay.html';
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = wishlistGames[i].cover;
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
        titleLink.href = 'game_overlay.html';
        const cardTitle = document.createElement('h4');
        cardTitle.classList.add('card-title');
        const title = document.createTextNode(wishlistGames[i].name);
        cardTitle.appendChild(title);
        titleLink.appendChild(cardTitle);
        cardBodyDiv.appendChild(titleLink);
        
        // Create card game description 
        const gameDescription = document.createElement('p');
        gameDescription.classList.add('card-text');
        const description = document.createTextNode(wishlistGames[i].description);
        gameDescription.appendChild(description);
        cardBodyDiv.appendChild(gameDescription);
        const bodyBR = document.createElement('br');
        cardBodyDiv.appendChild(bodyBR);

        // Add card body div to outer card row div
        cardBodyColumnDiv.appendChild(cardBodyDiv);
        cardRowDiv.appendChild(cardBodyColumnDiv);

        // Create divs for add to wishlist/not interested buttons and match accuracy text
        const cardButtonsColumnDiv = document.createElement('div');
        cardButtonsColumnDiv.classList.add('wishlistButtons', 'col-md-2', 'd-flex', 'align-items-center', 'justify-content-center', 'pl-3', 'pr-4');
        const buttonDiv = document.createElement('div'); 
        
        /* Create match accuracy text
        const matchP = document.createElement('p');
        matchP.classList.add('match_accuracy_text');
        const matchPercentage = document.createTextNode('Match Accuracy: 80%');
        matchP.appendChild(matchPercentage);
        buttonDiv.appendChild(matchP);
        */
        
        // Create Remove from Wishlist button
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn','btn-danger', 'mb-4', 'btn-lg', 'ml-2');
        removeButton.innerText='Remove';
        removeButton.addEventListener('click', () => removeFromWishlist(mainCardDiv, wishlistGames[i].id));
        
        // Add button to outer button div
        const buttonBR = document.createElement('br');
        buttonDiv.appendChild(buttonBR);
        buttonDiv.appendChild(removeButton);
        
        // Add button div to outer column div, then add to outer row div for card
        cardButtonsColumnDiv.appendChild(buttonDiv);
        cardRowDiv.appendChild(cardButtonsColumnDiv);
        
        // Add card row div to main card div and add card div to container of cards
        mainCardDiv.appendChild(cardRowDiv);
        gameCardsDiv.appendChild(mainCardDiv);
    }
}

async function removeFromWishlist(mainCardDiv, gameId)
{
    
    const wishlistRemoveResponse = await fetch(url+'/user/wishlist/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID': userID, 'gameID': gameId})
    });
    
    if(wishlistRemoveResponse.ok)
    {
        const parent = mainCardDiv.parentNode;
        parent.removeChild(mainCardDiv);

        if(parent.childElementCount === 0)
        {
            
            const emptyWishlistDiv = document.createElement('div');
            emptyWishlistDiv.classList.add('emptydiv', 'bottomDiv');
            const emptyWishlistTextNode = document.createTextNode('Add some games to your wishlist and you will see them here!');
            emptyWishlistDiv.appendChild(emptyWishlistTextNode);
    
            document.getElementById('emptywishlist').appendChild(emptyWishlistDiv);
            return;
        }
    }
    else
    {
        alert('Could not remove game from wishlist!');
    }
}