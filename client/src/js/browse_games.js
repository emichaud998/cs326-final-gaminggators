window.addEventListener('load', browseGamesStart);

function browseGamesStart() {
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
}

function addGameCards(gameCardsDiv) {
    for (let i = 0; i < 3; i++) {
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('card-deck', 'row', 'mb-3');
        for (let i = 0; i < 3; i++) {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1w9u.jpg';
            cardDiv.appendChild(image);
            
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            const title = document.createTextNode('Kirby & the Amazing Mirror');
            cardTitle.appendChild(title);
            cardBodyDiv.appendChild(cardTitle);
            
            const gameDescription = document.createElement('p');
            gameDescription.classList.add('card-text');
            const description = document.createTextNode('Game Description will go here');
            gameDescription.appendChild(description);
            cardBodyDiv.appendChild(gameDescription);

            const ratingsDiv = document.createElement('div');
            ratingsDiv.classList.add('d-flex', 'flex-row');
            const ratingLabel = document.createElement('p');
            ratingLabel.classList.add('mr-3', 'mt-n1');
            const textRatingLabel = document.createTextNode('Your Rating: ');
            ratingLabel.appendChild(textRatingLabel);
            ratingsDiv.appendChild(ratingLabel);

            for (let starCount = 0; starCount < 5; starCount++){
                const starSpan = document.createElement('span');
                starSpan.classList.add('fa', 'fa-star');
                ratingsDiv.appendChild(starSpan);
            }

            const submitButton = document.createElement('button');
            submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'mt-n2', 'ml-2', 'h-25');
            submitButton.innerText='Submit';
            ratingsDiv.appendChild(submitButton);

            cardBodyDiv.appendChild(ratingsDiv);
            cardDiv.appendChild(cardBodyDiv);
            cardRowDiv.appendChild(cardDiv);
        }
        gameCardsDiv.appendChild(cardRowDiv);
    }
}
