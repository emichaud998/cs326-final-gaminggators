window.addEventListener('load', browseGamesStart);
const url = 'http://localhost:8080';
const username = 'Jill_Valentine';

async function browseGamesStart() {
    addEventListeners();
    document.getElementById('Genre_button').click();
    filterSideBarSetup();
    const gameCardsDiv = document.getElementById('gameCards');
    const response = await fetch(url+'/user/ratings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username':username})
    });
    const user_ratings = await response.json();
    await fetch(url+'/games/allGames')
    .then(response => response.json())
    .then(data => addGameCards(data, gameCardsDiv, user_ratings));
}

async function filterSideBarSetup() {
    let response = await fetch(url+'/games/allGenres');
    const genres = await response.json();
    response = await fetch(url+'/games/allReleaseYears');
    const release_years = await response.json();
    
    const genre_div = document.getElementById('genre_filter');
    for (const genre of genres) {
        const genreButton = document.createElement('div');
        genreButton.classList.add('btn', 'filter_buttons');
        genreButton.innerHTML = genre;
        genre_div.appendChild(genreButton);
    }
    const release_year_div = document.getElementById('release_date_filter');
    for (const year of release_years) {
        const release_year_button = document.createElement('div');
        release_year_button.classList.add('btn','filter_buttons','mar-sm-right','mar-sm-bottom');
        release_year_button.innerHTML = year;
        release_year_div.insertBefore(release_year_button, release_year_div.firstChild);
    }
}

function addEventListeners() {
    const filterTabs = document.getElementsByClassName('tablinks');
    for (const tab of filterTabs) {
        const tabId = tab.id;
        const tabSubstring = tabId.substring(0, tabId.indexOf('_'));
        tab.addEventListener('click', () => {openFilterTab(tab, tabSubstring);});
    }
    const ratingRadioButtons = document.getElementsByName('choice-rating_filter');
    for (const button of ratingRadioButtons) {
        button.addEventListener('click', ratingFilter);
    }
    //document.getElementById('gameSearchBar').addEventListener('click', gameSearch);
    //document.getElementById('sort_title').addEventListener('click', sortTitle);
    //document.getElementById('sort_rating').addEventListener('click', sortRating);
    //document.getElementById('sort_release_date').addEventListener('click', sortReleaseDate);
}

function ratingFilter() {
    const ratingButton = document.getElementById('my_ratings');
    if (ratingButton.checked) {
        document.getElementById('rating_select_form').style.display = 'block';
    } else {
        document.getElementById('rating_select_form').style.display = 'none';
    }
}

function openFilterTab(tab, filterName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('active');
    }
    document.getElementById(filterName).style.display = "block";
    tab.classList.add('active');
}

async function ratingSubmit(ratingsDiv, gameID) {
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
                body: JSON.stringify({'username':username,'rating':starCount,'gameID':gameID})
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
                body: JSON.stringify({'username':username,'gameID':gameID})
            });
            if (!response.ok) {
                throw "Error removing rating from ratings list";
            } 
        }
    }
}

function clickStar(starDiv, ratingsDiv, starCount) {

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

function addGameCards(gameList, gameCardsDiv, user_ratings) {
    const outerIndex = Math.ceil(gameList.length/3);
    // First for loop is the number of rows of cards, second for loop creates 3 cards per row
    let counter = 0;
    for (let j = 0; j < outerIndex; j++) {
        // Create card div for row
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
        for (let i = 0; i < 3; i++) {
            if (gameList[i] === undefined) {
                return;
            }
            // Create main card div per card
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.id = gameList[counter].id;

            // Create div for game card image
            const pictureLink = document.createElement('a');
            pictureLink.href = 'game_overlay.html';
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
            titleLink.href = 'game_overlay.html';
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
