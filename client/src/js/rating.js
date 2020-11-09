'use strict';
const url = 'http://localhost:8080';
const userID = '1111';

// Submits a rating for a game to the server 
export async function ratingSubmit(ratingsDiv, gameID) {
    let starCount = 0;
    for (let i = 1; i <= 5; i++) {
        if (ratingsDiv.childNodes[i].style.color === 'gold') {
            starCount++;
        }
        if (starCount > 0) {
            const response = await fetch(url+'/user/ratings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'userID':userID,'rating':starCount,'gameID':gameID})
            });
            if (!response.ok) {
                throw "Error adding rating to ratings list";
            } 
        } else {
            const response = await fetch(url+'/user/ratings/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'userID':userID,'gameID':gameID})
            });
            if (!response.ok) {
                throw "Error removing rating from ratings list";
            } 
        }
    }
}

// Function for selecting/de-selecting stars for rating
export function clickStar(starDiv, ratingsDiv, starCount) {

    if (starDiv.style.color === 'gold' && (starCount === 5 || ratingsDiv.childNodes[starCount+1].style.color !== 'gold')) {
        for (let i = starCount; i >= 1; i--) {
            if (ratingsDiv.childNodes[i].style.color === 'gold') {
                ratingsDiv.childNodes[i].style.color = 'black';
            }
        }
        return;
    }

    for (let i = starCount; i >= 1; i--) {
        if (ratingsDiv.childNodes[i].style.color !== 'gold') {
            ratingsDiv.childNodes[i].style.color = 'gold';
        }
    }
    
    for (let i = starCount + 1; i <= 5; i++) {
        if (ratingsDiv.childNodes[i].style.color === 'gold') {
            ratingsDiv.childNodes[i].style.color = 'black';
        }
    }
}

export async function wishlistAdd(gameID) {
    await fetch(url+'/user/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID, 'gameID': gameID})
    });
}

export async function sendMessage(type, friendUsername) {
    let endpoint;
    if (type === 'ratedGames') {
        endpoint = '/user/ratings';
    } else {
        endpoint = '/user/wishlist';
    }
    const response = await fetch(url+endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    });
    await response.json()
    .then(async function(message) {
        await fetch(url+'/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'userID':userID, 'friendUsername': friendUsername, 'message': message})
        });
    });
}

export async function removeRecommendation(gameID, gameCardsDiv) {
    await fetch(url+'/user/recommendations/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID, 'gameID': gameID})
    });
    const gameCard = document.getElementById(gameID);
    gameCard.parentNode.removeChild(gameCard);
    checkRenderEmpty(gameCardsDiv, 'Recommendations Coming Soon!', 'https://cdna.artstation.com/p/assets/images/images/028/102/058/original/pixel-jeff-matrix-s.gif?1593487263');
}

export function checkRenderEmpty(gameCardsDiv, messageText, imageURL) {
    if (gameCardsDiv.childElementCount === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty_div');

        const emptyMessageDiv = document.createElement('div');
        emptyMessageDiv.classList.add('empty-message-div');

        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('empty-message-text');
        const message = document.createTextNode(messageText);
        emptyMessage.appendChild(message);
        emptyMessageDiv.appendChild(emptyMessage);
        emptyDiv.appendChild(emptyMessageDiv);
        emptyDiv.style.backgroundImage = "url("+imageURL+")";
        gameCardsDiv.appendChild(emptyDiv);
        
    }
}

export function getRatingStats(ratings)
{
    if(ratings.length === 0){return -1;}

    const ratingObj = {};
    ratingObj.onestar = 0;
    ratingObj.twostar = 0;
    ratingObj.threestar = 0;
    ratingObj.fourstar = 0;
    ratingObj.fivestar = 0;

    for(let i = 0; i < ratings.length; i++)
    {
        if(ratings[i].rating === 1)
        {
            ratingObj.onestar++;
        }
        else if(ratings[i].rating === 2)
        {
            ratingObj.twostar++;
        }
        else if(ratings[i].rating === 3)
        {
            ratingObj.threestar++;
        }
        else if(ratings[i].rating === 4)
        {
            ratingObj.fourstar++;
        }
        else if(ratings[i].rating === 5)
        {
            ratingObj.fivestar++;
        }
    }

    return ratingObj;
}