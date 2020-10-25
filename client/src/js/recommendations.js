window.addEventListener('load', recommendationsStart);

function recommendationsStart() {
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
}

function addGameCards(gameCardsDiv) {
    for (let i = 0; i < 6; i++) {
        // Create main card divs
        const mainCardDiv = document.createElement('div');
        mainCardDiv.classList.add('card', 'mb-3');
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('row');
        
        // Create div column for game image
        const cardImageColumnDiv = document.createElement('div');
        cardImageColumnDiv.classList.add('col-md-3', 'p-0', 'd-flex', 'align-items-center', 'justify-content-center');
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = 'https://www.mobygames.com/images/covers/l/55423-kirby-the-amazing-mirror-game-boy-advance-front-cover.jpg';
        cardImageColumnDiv.appendChild(image);
        cardRowDiv.appendChild(cardImageColumnDiv);
        
        // Create divs for card body
        const cardBodyColumnDiv = document.createElement('div');
        cardBodyColumnDiv.classList.add('col-md-7', 'p-0');
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');
        
        // Create card game title
        const cardTitle = document.createElement('h4');
        cardTitle.classList.add('card-title');
        const title = document.createTextNode('Kirby & the Amazing Mirror');
        cardTitle.appendChild(title);
        cardBodyDiv.appendChild(cardTitle);
        
        // Create card game description 
        const gameDescription = document.createElement('p');
        gameDescription.classList.add('card-text');
        const description = document.createTextNode('Game Description will go here.');
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

        // Create card game rating stars
        for (let starCount = 0; starCount < 5; starCount++){
            const starDiv = document.createElement('div');
            starDiv.classList.add('fa', 'fa-star', 'mt-1');
            ratingsDiv.appendChild(starDiv);
        }

        // Create card game rating submit button and add ratings div to card body div
        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-3', 'h-25', 'p-n2');
        submitButton.innerText='Submit';
        ratingsDiv.appendChild(submitButton);
        cardBodyDiv.appendChild(ratingsDiv);

        // Add card body div to outer card row div
        cardBodyColumnDiv.appendChild(cardBodyDiv)
        cardRowDiv.appendChild(cardBodyColumnDiv)

        // Create divs for add to wishlist/not interested buttons and match accuracy text
        const cardButtonsColumnDiv = document.createElement('div');
        cardButtonsColumnDiv.classList.add('col-md-2', 'd-flex', 'align-items-center', 'justify-content-center', 'pl-0', 'pr-4');
        const buttonDiv = document.createElement('div'); 
        
        // Create match accuracy text
        const matchP = document.createElement('p');
        matchP.classList.add('match_accuracy_text');
        const matchPercentage = document.createTextNode('Match Accuracy: 80%');
        matchP.appendChild(matchPercentage);
        buttonDiv.appendChild(matchP);

        // Create add to wishlist button
        const wishlistButton = document.createElement('button');
        wishlistButton.classList.add('btn', 'btn-success');
        wishlistButton.innerText='Add to wishlist';
        
        // Create not interested button
        const removeRecommendationButton = document.createElement('button');
        removeRecommendationButton.classList.add('btn','btn-danger', 'mt-3');
        removeRecommendationButton.innerText='Not interested';
        
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
