window.addEventListener('load', browseGamesStart);

function browseGamesStart() {
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
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
            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = 'https://www.mobygames.com/images/covers/l/55423-kirby-the-amazing-mirror-game-boy-advance-front-cover.jpg';
            cardDiv.appendChild(image);
            
            // Create div for game card body
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');

            // Add game title to game card body
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            const title = document.createTextNode('Kirby & the Amazing Mirror');
            cardTitle.appendChild(title);
            cardBodyDiv.appendChild(cardTitle);
            
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
            for (let starCount = 0; starCount < 5; starCount++){
                const starDiv = document.createElement('div');
                starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
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
