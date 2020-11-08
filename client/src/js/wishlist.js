window.addEventListener('load', wishlistStart);

function wishlistStart() {
    const gameCardsDiv = document.getElementById('gameCards');
    addGameCards(gameCardsDiv);
}

function addGameCards(gameCardsDiv) {
    for (let i = 0; i < 6; i++) {
        // Create main card divs
        const mainCardDiv = document.createElement('div');
        mainCardDiv.classList.add('card', 'cardRow', 'mb-3', 'bottomDiv');
        const cardRowDiv = document.createElement('div');
        cardRowDiv.classList.add('row');
        
        // Create div column for game image
        const cardImageColumnDiv = document.createElement('div');
        cardImageColumnDiv.classList.add('col-md-3', 'p-0', 'd-flex', 'align-items-center', 'justify-content-center');
        const pictureLink = document.createElement('a');
        pictureLink.href = 'game_overlay.html';
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = 'https://i.redd.it/1nenzdmf2lu31.jpg';
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
        const title = document.createTextNode('The Legend of Zelda Twilight Princess');
        cardTitle.appendChild(title);
        titleLink.appendChild(cardTitle);
        cardBodyDiv.appendChild(titleLink);
        
        // Create card game description 
        const gameDescription = document.createElement('p');
        gameDescription.classList.add('card-text');
        const description = document.createTextNode('Game Description will go here.');
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
        
        // Create match accuracy text
        const matchP = document.createElement('p');
        matchP.classList.add('match_accuracy_text');
        const matchPercentage = document.createTextNode('Match Accuracy: 80%');
        matchP.appendChild(matchPercentage);
        buttonDiv.appendChild(matchP);
        
        // Create Remove from Wishlist button
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn','btn-danger', 'mt-3', 'btn-lg', 'ml-2');
        removeButton.innerText='Remove';
        
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