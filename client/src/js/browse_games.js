window.addEventListener('load', browseGamesStart);

function browseGamesStart() {
    addEventListeners();
    document.getElementById('Genre_button').click();
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
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

function addGameCards(gameCardsDiv) {
    // First for loop is the number of rows of cards, second for loop creates 3 cards per row
    for (let i = 0; i < 6; i++) {
        // Create card div for row
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
        for (let i = 0; i < 3; i++) {
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
            
            // Add description to game card body
            const gameDescription = document.createElement('p');
            gameDescription.classList.add('card-text');
            const description = document.createTextNode('Game Description will go here');
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

            // Create card game rating stars
            for (let starCount = 1; starCount <= 5; starCount++){
                const starDiv = document.createElement('div');
                starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
                starDiv.addEventListener('click', () => {clickStar(starDiv, ratingsDiv, starCount);});
                ratingsDiv.appendChild(starDiv);
            }

            // Create card game rating submit button and add ratings div to card body div
            const submitButton = document.createElement('button');
            submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-2', 'h-25', 'mt-n1');
            submitButton.innerText='Submit';
            ratingsDiv.appendChild(submitButton);
            cardBodyDiv.appendChild(ratingsDiv);

            // Add single card div to row of cards
            cardDiv.appendChild(cardBodyDiv);
            cardRowDiv.appendChild(cardDiv);
        }
        // Add rows of game cards to container of game card rows
        gameCardsDiv.appendChild(cardRowDiv);
    }
}
