'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters} from './filtering.js';
import {sortTitle, sortRating, sortReleaseDate, sortDefault} from './sorting.js';
import {clickStar, ratingSubmit, sendMessage, checkRenderEmpty, getRatingStats} from './rating.js';

window.addEventListener('load', gamesStart);
const url = 'http://localhost:8080';
const userID = '1111';

async function gamesStart() {
    window.filters = [];
    filterSideBarSetup();
    addEventListeners();
    createBarGraph();
    document.getElementById('Genre_button').click();
    autocompleteSetup(true, true, 'POST', '/user/ratings/allTitles');
    const response = await fetch(url+'/user/ratings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    });
    await response.json()
    .then(function(user_ratings){ renderGameRatingList(user_ratings);});
}

async function renderGameRatingList(user_ratings) {
    const gameCardsDiv = document.getElementById('gameCards');
    const response = await fetch(url+'/games/list/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameList': user_ratings})
    });
    await response.json()
    .then(function(rating_game_info) {addGameCards(rating_game_info, gameCardsDiv, user_ratings);});
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
    document.getElementById('send_friend_button').addEventListener('click', () => {sendMessage('ratedGames', document.getElementById('send_friend_username').value.toString());});
}

// Add game cards to main body container of the page
function addGameCards(gameList, gameCardsDiv, user_ratings) {
    gameCardsDiv.innerHTML = '';
    gameCardsDiv.classList.add('container', 'ml-4', 'mt-4');
    if (gameList.length <= 0) {
        checkRenderEmpty(gameCardsDiv, 'Your Rated Games Will Show Up Here!', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/12cbe8a4-f55c-4b40-85bb-d8e1405e7b84/d9nwsnt-d8dcabb0-6ce0-46aa-b34a-8e7e5c041296.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTJjYmU4YTQtZjU1Yy00YjQwLTg1YmItZDhlMTQwNWU3Yjg0XC9kOW53c250LWQ4ZGNhYmIwLTZjZTAtNDZhYS1iMzRhLThlN2U1YzA0MTI5Ni5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ._TP6_w9ntB5yRPfr86_aYheggh4Lacm5FVU-_9qLWww');
        return;
    }
    const outerIndex = Math.ceil(gameList.length/4);
    // First for loop is the number of rows of cards, second for loop creates 3 cards per row
    let counter = 0;
    for (let j = 0; j < outerIndex; j++) {
        // Create card div for row
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
        for (let i = 0; i < 4; i++) {
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

            const breakline = document.createElement('br');
            ratingsDiv.appendChild(breakline);

            // Create card game rating submit button and add ratings div to card body div
            const submitButton = document.createElement('button');
            submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'h-25', 'mt-n1');
            submitButton.innerText='Submit';
            submitButton.addEventListener('click', () => {ratingSubmit(ratingsDiv, cardDiv.id);});
            submitButton.addEventListener('click', () => {checkEmpty(ratingsDiv, cardDiv.id, user_ratings);});
            ratingsDiv.appendChild(submitButton);
            cardBodyDiv.appendChild(ratingsDiv);

            // Add single card div to row of cards
            cardDiv.appendChild(cardBodyDiv);
            cardRowDiv.appendChild(cardDiv);

            counter++;
        }
        // Add rows of game cards to container of game card rows
        gameCardsDiv.appendChild(cardRowDiv);
    }
}

function checkEmpty(gameRatingDiv, cardID, user_ratings) {
    const gameCard = document.getElementById(cardID);
    const parentCard = gameCard.parentNode;
    let starCount = 0;
    
    for (let i = 1; i <= 5; i++) {
        if (gameRatingDiv.childNodes[i].style.color === 'gold') {
            starCount++;
        }
    }
    if (starCount === 0) {
        parentCard.removeChild(gameCard);
        const removedCard = user_ratings.find(game => {
            return game.gameID === cardID;
        });
        if (removedCard) {
            user_ratings.splice(user_ratings.indexOf(removedCard), 1);
            renderGameRatingList(user_ratings);
        }
    }

    checkRenderEmpty(parentCard, 'Rate games to add them to your game list!', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/12cbe8a4-f55c-4b40-85bb-d8e1405e7b84/d9nwsnt-d8dcabb0-6ce0-46aa-b34a-8e7e5c041296.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTJjYmU4YTQtZjU1Yy00YjQwLTg1YmItZDhlMTQwNWU3Yjg0XC9kOW53c250LWQ4ZGNhYmIwLTZjZTAtNDZhYS1iMzRhLThlN2U1YzA0MTI5Ni5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ._TP6_w9ntB5yRPfr86_aYheggh4Lacm5FVU-_9qLWww');
    createBarGraph();
}

async function createBarGraph()
{
    
    const ratingsResponse = await fetch(url+'/user/ratings', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: userID})
    });
    let ratingStats;
    let ratings;
     await ratingsResponse.json()
    .then((data) => {
        ratingStats = getRatingStats(data); 
        ratings = data;
    });

    if(ratingStats === -1)
    {
        return;
    }

    //chart data
    let chartjson = {
        "title": "Your Game Ratings",
        "data": [{
        "name": "Amazing",
        "score": Math.round((ratingStats.fivestar/ratings.length) * 100)
        }, {
        "name": "Great",
        "score": Math.round((ratingStats.fourstar/ratings.length) * 100)
        }, {
        "name": "Good",
        "score": Math.round((ratingStats.threestar/ratings.length) * 100)
        }, {
        "name": "Meh",
        "score": Math.round((ratingStats.twostar/ratings.length) * 100)
        }, {
        "name": "Terrible",
        "score": Math.round((ratingStats.onestar/ratings.length) * 100)
        }],
        "xtitle": "Secured Marks",
        "ytitle": "Marks",
        "ymax": ratings.length,
        "ykey": 'score',
        "xkey": "name",
        "prefix": "%"
    }
    
    //chart colors
    let colors = ['one', 'two', 'three', 'four', 'five'];
    
    //constants
    let TROW = 'tr',
        TDATA = 'td';
    
    let chart = document.createElement('div');
    chart.classList.add('centergraph');
    //create the chart canvas
    let barchart = document.createElement('table');
    //create the title row
    let titlerow = document.createElement(TROW);
    //create the title data
    let titledata = document.createElement(TDATA);
    //make the colspan to number of records
    titledata.setAttribute('colspan', 5);
    titledata.setAttribute('class', 'charttitle');
    titledata.innerText = chartjson.title;
    titlerow.appendChild(titledata);
    barchart.appendChild(titlerow);
    chart.appendChild(barchart);
    
    //create the bar row
    let barrow = document.createElement(TROW);
    
    //lets add data to the chart
    for (let i = 0; i < chartjson.data.length; i++) {
        barrow.setAttribute('class', 'bars');
        let prefix = chartjson.prefix || '';
        //create the bar data
        let bardata = document.createElement(TDATA);
        let bar = document.createElement('div');
        bar.setAttribute('class', colors[i]);
        bar.style.height = chartjson.data[i][chartjson.ykey] + prefix;
        bardata.innerText = chartjson.data[i][chartjson.ykey] + prefix;
        bardata.appendChild(bar);
        barrow.appendChild(bardata);
    }
    
    //create legends
    let legendrow = document.createElement(TROW);
    let legend = document.createElement(TDATA);
    legend.setAttribute('class', 'legend');
    legend.setAttribute('colspan', chartjson.data.length);
    
    //add legend data
    for (let i = 0; i < chartjson.data.length; i++) {
        let legbox = document.createElement('span');
        legbox.setAttribute('class', 'legbox');
        let barname = document.createElement('span');
        barname.setAttribute('class', colors[i] + ' xaxisname');
        let bartext = document.createElement('span');
        bartext.innerText = chartjson.data[i][chartjson.xkey];
        legbox.appendChild(barname);
        legbox.appendChild(bartext);
        legend.appendChild(legbox);
    }
    barrow.appendChild(legend);
    barchart.appendChild(barrow);
    barchart.appendChild(legendrow);
    chart.appendChild(barchart);
    document.getElementById('chartContainer').innerHTML = chart.outerHTML;
}