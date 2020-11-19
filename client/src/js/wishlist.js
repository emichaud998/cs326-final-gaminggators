'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, applySelectedFilters} from './filtering.js';
import {sortTitle, sortPopularity, sortReleaseDate} from './sorting.js';
import {sendMessage, fetchGameListInfo, fetchGameFilterList} from './helpers.js';

window.addEventListener('load', wishlistStart);

async function wishlistStart() {

    window.filters = [];
    sortPopularity(false);
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(false, true, null);
    await renderWishlist();
}

async function renderWishlist() {
    const wishlist_games = await fetchGameListInfo('/user/wishlist');
    if (wishlist_games.length !== 0) {
        addGameCards(wishlist_games);
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
        addGameCards(null);
    });
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    document.getElementById('sort_title_ascend').addEventListener('click', async () => {
        await sortTitle(true);
        addGameCards(null);
    });
    document.getElementById('sort_title_descend').addEventListener('click', async () => {
        await sortTitle(false);
        addGameCards(null);

    });
    document.getElementById('sort_popularity_ascend').addEventListener('click', async () => {
        await sortPopularity(true);
        addGameCards(null);
    });
    document.getElementById('sort_popularity_descend').addEventListener('click', async () => {
        await sortPopularity(false);
        addGameCards(null);
    });
    document.getElementById('sort_release_date_ascend').addEventListener('click', async () => {
        await sortReleaseDate(true);
        addGameCards(null);
    });
    document.getElementById('sort_release_date_descend').addEventListener('click', async () => {
        await sortReleaseDate(false);
        addGameCards(null);
    });
    document.getElementById('sendtofriendbutton').addEventListener('click', () => {sendMessage('wishlistGames', document.getElementById('send_friend_username').value.toString());});
}

async function addGameCards(wishlistGames) {
    const gameCardsDiv = document.getElementById('gameCards');
    //let file = {'filename' : 'My_Game_Wishlist.csv'}
    //document.getElementById('exportwishlist').addEventListener('click', () => downloadCSV(file, wishlistGames));
    gameCardsDiv.innerHTML= '';
    gameCardsDiv.classList.add('container', 'mt-n5');

    if (window.filters.length !== 0) {
        const filters = applySelectedFilters(window.filters, 'user_wishlists');
        wishlistGames = await fetchGameFilterList('/game/list/filter/custom' , filters); 
    } else if (wishlistGames === null){
        wishlistGames =  await fetchGameListInfo('/user/wishlist');
    }

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
        const hrefLink = "game_overlay.html?gameID="+ wishlistGames[i].id;
        pictureLink.href = hrefLink;
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        if (wishlistGames[i].cover !== null) {
            //image.src = 'https://' + wishlistGames[i].cover;
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

async function removeFromWishlist(mainCardDiv, gameId) {
    
    const wishlistRemoveResponse = await fetch('/user/wishlist/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameID': parseInt(gameId)})
    });
    
    if(wishlistRemoveResponse.ok) {
        const parent = mainCardDiv.parentNode;
        parent.removeChild(mainCardDiv);

        if(parent.childElementCount === 0) {
            
            renderEmpty();
            return;
        }
    }
    else {
        alert('Could not remove game from wishlist!');
    }
}

function renderEmpty() {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty_div');

    const emptyMessageDiv = document.createElement('div');
    emptyMessageDiv.classList.add('empty-message-div');

    const emptyMessage = document.createElement('p');
    emptyMessage.classList.add('empty-message-text');
    const message = document.createTextNode('Your Wishlist Games Will Show Up Here!');
    emptyMessage.appendChild(message);
    emptyMessageDiv.appendChild(emptyMessage);
    emptyDiv.appendChild(emptyMessageDiv);
    emptyDiv.style.backgroundImage = "url('https://cdna.artstation.com/p/assets/images/images/025/924/688/original/pixel-jeff-stay.gif?1587360519')";

    document.getElementById('emptywishlist').appendChild(emptyDiv);
}