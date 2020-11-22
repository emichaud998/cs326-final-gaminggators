'use strict';

// Submits a rating for a game to the server 
export async function ratingSubmit(ratingsDiv, gameID) {
    let starCount = 0;
    for (let i = 1; i <= 5; i++) {
        if (ratingsDiv.childNodes[i].style.color === 'gold') {
            starCount++;
        }
        if (starCount > 0) {
            const response = await fetch('/user/ratings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'rating':starCount,'gameID':gameID})
            });
            if (!response.ok) {
                alert("Error adding rating to ratings list");
                return;
            } 
        } else {
            const response = await fetch('/user/ratings/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'gameID':gameID})
            });
            if (!response.ok) {
                alert("Error removing rating from ratings list");
                return;
            } else {
                return;
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
    const response = await fetch('/user/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameID': gameID})
    });
    if (!response.ok) {
        alert("Error adding game to wishlist");
        return;
    } 
}

export async function sendMessage(type, friendUsername) {
    let endpoint;
    if (type === 'ratedGames') {
        endpoint = '/user/ratings/info';
    } else {
        endpoint = '/user/wishlist';
    }
    const response = await fetch(endpoint, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'sorting': { 'sortBy': 'rating_count', 'order': 'DESC' }}) // body data type must match "Content-Type" header
    });
    if (response.ok) {
        await response.json()
        .then(async function(gameList) {
            const messageResponse = await fetch('/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'friendUsername': friendUsername, 'gameList': gameList})
            });
            if (!messageResponse.ok){
                alert("Error sending message");
                return;
            }
        });
    }
}

export async function removeRecommendation(gameID, gameCardsDiv) {
    const response = await fetch('/user/recommendations/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'gameID': gameID.toString()})
    });
    if (response.ok) {
        const gameCard = document.getElementById(gameID);
        gameCard.parentNode.removeChild(gameCard);
        checkRenderEmpty(gameCardsDiv, 'Refresh for More Recommendations!', 'https://cdna.artstation.com/p/assets/images/images/028/102/058/original/pixel-jeff-matrix-s.gif?1593487263');
    } else {
        alert("Error removing recommendation");
        return;
    }
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

export async function fetchUserRating() {
    const ratingResponse = await fetch('/user/ratings');
    if (ratingResponse.ok) {
        const user_ratings = await ratingResponse.json();
        return user_ratings;
    }
    return null;
}

export async function fetchGameList() {
    const sortingObj = window.sorting;
    const gameResponse = await fetch('/games/allGames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'sorting': sortingObj})
    });
    if (gameResponse.ok) {
        const gameList = await gameResponse.json();
        return gameList;
    }
    return null;
}

export async function fetchGameFilterList(endpoint , data) {
    const filterResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (filterResponse.ok) {
        const gameList = await filterResponse.json();
        return gameList;
    }
    return null;
}

export async function fetchSearchFilterList(endpoint, filters, searchList) {
    const sortingObj = window.sorting;
    filters['sorting'] = sortingObj;
    filters['searchList'] = searchList;
    const gameResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    });
    if (gameResponse.ok) {
        const gameList = await gameResponse.json();
        return gameList;
    }
    return null;
}

export async function fetchGameListInfo(endpoint) {
    const sortingObj = window.sorting;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'sorting': sortingObj})
    });
    if (response.ok) {
        const gameList = await response.json();
        return gameList;
    }
    return null;
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