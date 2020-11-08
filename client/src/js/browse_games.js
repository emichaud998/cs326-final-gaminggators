window.addEventListener('load', browseGamesStart);
const url = 'http://localhost:8080';
const userID = '1111';

async function browseGamesStart() {
    addEventListeners();
    document.getElementById('Genre_button').click();
    filterSideBarSetup();
    autocompleteSetup();
    const gameCardsDiv = document.getElementById('gameCards');
    const response = await fetch(url+'/user/ratings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'userID':userID})
    });
    const user_ratings = await response.json();
    await fetch(url+'/games/allGames')
    .then(response => response.json())
    .then(data => addGameCards(data, gameCardsDiv, user_ratings));
}


async function autocompleteSetup() {
    let response = await fetch(url+'/games/allTitles');
    const titles = await response.json();
    if (response.ok) {
        autocomplete(document.getElementById('title-search'), titles, titleSearch);
    }

    response = await fetch(url+'/games/allPlatforms');
    const platforms = await response.json();
    if (response.ok) {
        autocomplete(document.getElementById('platform_filter'), platforms, platformSearch);
    }

    response = await fetch(url+'/games/allFranchises');
    const franchises = await response.json();
    if (response.ok) {
        autocomplete(document.getElementById('franchise_filter'), franchises, franchiseSearch);
    }

    response = await fetch(url+'/games/allCompanies');
    const companies = await response.json();
    if (response.ok) {
        autocomplete(document.getElementById('company_filter'), companies, companySearch);
    }
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
        genreButton.addEventListener('click', () => {filterButtonClick(genreButton);});
        genre_div.appendChild(genreButton);
    }
    document.getElementById('genre_filter_clear').addEventListener('click', ()=>{filterHighlightClear(genre_div);});
    const release_year_div = document.getElementById('release_date_filter');
    for (const year of release_years) {
        const release_year_button = document.createElement('div');
        release_year_button.classList.add('btn','filter_buttons','mar-sm-right','mar-sm-bottom');
        release_year_button.innerHTML = year.toString();
        release_year_button.addEventListener('click', () => {filterButtonClick(release_year_button);});
        release_year_div.insertBefore(release_year_button, release_year_div.firstChild);
    }
    const highestDecade = (release_years[release_years.length-1] - release_years[release_years.length-1]%10);
    const lowestDecade = (release_years[0] - release_years[0]%10);
    for (let decade = highestDecade; decade >= lowestDecade; decade=decade-10) {
        const release_year_button = document.createElement('div');
        release_year_button.classList.add('btn','filter_buttons','mar-sm-right','mar-sm-bottom');
        release_year_button.innerHTML = decade.toString() + 's';
        release_year_button.addEventListener('click', () => {filterButtonClick(release_year_button);});
        release_year_div.appendChild(release_year_button, release_year_div.firstChild);
    }
    document.getElementById('release-date_filter_clear').addEventListener('click', ()=>{filterHighlightClear(release_year_div);});
}

function filterButtonClick(genreButton) {
    if (genreButton.style.backgroundColor !== 'steelblue') {
        genreButton.style.backgroundColor = 'steelblue';
    } else {
        genreButton.style.backgroundColor = '#f7f8fa';
    }
}

function filterButtonClickRemove(buttonDiv, button) {
    buttonDiv.removeChild(button);
}

function filterButtonClear(div) {
    const filter_buttons = div.getElementsByClassName('filter_buttons');
    const length = filter_buttons.length;
    if (filter_buttons.length > 0) {
        for (let i = 0; i < length; i++) {
            div.removeChild(filter_buttons[0]);
        }
    }
}

function filterHighlightClear(div) {
    const filter_buttons = div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            button.style.backgroundColor = '#f7f8fa';
        }
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
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'));});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'));});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'));});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    
    
    //document.getElementById('gameSearchBar').addEventListener('click', gameSearch);
    //document.getElementById('sort_title').addEventListener('click', sortTitle);
    //document.getElementById('sort_rating').addEventListener('click', sortRating);
    //document.getElementById('sort_release_date').addEventListener('click', sortReleaseDate);
}

// Needs to be completed still
function ratingFilterApply() {
    const myRatingButton = document.getElementById('my_ratings');
    const  noRatingButton = document.getElementById('no_ratings');
    if (myRatingButton.checked) {
        const ratingHigh = document.getElementById('max-rating');
        const ratingLow = document.getElementById('min-rating');
        console.log(ratingHigh, ratingLow);
    } else if (noRatingButton.checked) {
        console.log('no rating');
    }
    return;
}

function ratingFilterClear() {
    const myRatingButton = document.getElementById('my_ratings');
    const  noRatingButton = document.getElementById('no_ratings');
    if (myRatingButton.checked) {
        myRatingButton.checked = false;
        document.getElementById('rating_select_form').style.display = 'none';
    } else if (noRatingButton.checked) {
        noRatingButton.checked = false;
    }
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

function autocomplete(inputDiv, arr, func) {
    inputDiv.addEventListener('input', function() {
        const searchVal = inputDiv.value;
        
        //close any already open lists of autocompleted values
        closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
        if (!searchVal) { 
            return false;
        }

        //create a DIV element that will contain the autocomplete suggestions:
        const autocompleteDiv = document.createElement('div');
        autocompleteDiv.setAttribute('id', inputDiv.id + 'autocomplete-list');
        autocompleteDiv.setAttribute('class', 'autocomplete-items');
        //append the DIV element as a child of the autocomplete container
        inputDiv.parentNode.appendChild(autocompleteDiv);

        let counter = 0;
        for (let i = 0; i < arr.length; i++) {
          //check if the item starts with the same letters as the text field value
          let word = '';
          if (typeof(arr[i]) === 'object') {
              word = arr[i].title;
          } else {
              word = arr[i];
          }
          if (word.substr(0, searchVal.length).toUpperCase() === searchVal.toUpperCase()) {
            if (counter >= 10) {
                return false;
            }
            /*create a DIV element for each matching element:*/
            const autocompleteItem = document.createElement('div');
            autocompleteItem.id = counter;
            counter++;
            /*make the matching letters bold:*/
            autocompleteItem.innerHTML = "<strong>" + word.substr(0, searchVal.length) + "</strong>";
            autocompleteItem.innerHTML += word.substr(searchVal.length);
            /*insert a input field that will hold the current array item's value:*/
            autocompleteItem.innerHTML += "<input type='hidden' value='" + word + "'>";
            if (typeof(arr[i]) === 'object') {
                autocompleteItem.name = arr[i].gameID;
            } else {
                autocompleteItem.name = arr[i];
            }
            /*execute a function when someone clicks on the item value (DIV element):*/
            autocompleteItem.addEventListener("click", () => {
                func(inputDiv, autocompleteItem, document.getElementById(inputDiv.id + 'autocomplete-list').getElementsByTagName('input')[autocompleteItem.id].value);
            });
            autocompleteDiv.appendChild(autocompleteItem);
          }
        }
        return true;
    });
}

function platformSearch(inputDiv, __, word) {
    const platform_filter_div = document.getElementById('applied_platform_filters');
    const filter_buttons = platform_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerHTML === word) {
                return;
            }
        }
    }
    const platformButton = document.createElement('div');
    platformButton.classList.add('btn', 'filter_buttons', 'mt-2');
    platformButton.innerHTML = word;
    platformButton.addEventListener('click', () => {filterButtonClickRemove(platform_filter_div, platformButton);});
    platform_filter_div.appendChild(platformButton);
    closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
    document.getElementById('platform_filter').value = '';
}

function franchiseSearch(inputDiv, __, word) {
    const franchise_filter_div = document.getElementById('applied_franchise_filters');
    const filter_buttons = franchise_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerHTML === word) {
                return;
            }
        }
    }
    const franchiseButton = document.createElement('div');
    franchiseButton.classList.add('btn', 'filter_buttons', 'mt-2');
    franchiseButton.innerHTML = word;
    franchiseButton.addEventListener('click', () => {filterButtonClickRemove(franchise_filter_div, franchiseButton);});
    franchise_filter_div.appendChild(franchiseButton);
    closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
    document.getElementById('franchise_filter').value = '';
}

function companySearch(inputDiv, __, word) {
    const company_filter_div = document.getElementById('applied_company_filters');
    const filter_buttons = company_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerHTML === word) {
                return;
            }
        }
    }
    const companyButton = document.createElement('div');
    companyButton.classList.add('btn', 'filter_buttons', 'mt-2');
    companyButton.innerHTML = word;
    companyButton.addEventListener('click', () => {filterButtonClickRemove(company_filter_div, companyButton);});
    company_filter_div.appendChild(companyButton);
    closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
    document.getElementById('company_filter').value = '';
}

function titleSearch(inputDiv, autocompleteItem, word) {
    /*insert the value for the autocomplete text field:*/
    inputDiv.value = word;
    inputDiv.name = autocompleteItem.name; // Set search bar id to game id that corresponds to title
    /*close the list of autocompleted values,
    (or any other open lists of autocompleted values:*/
    closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
}

function closeAllLists(elmnt, inp) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
      closeAllLists(e.target);
});
