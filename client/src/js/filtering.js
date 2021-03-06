'use strict';


// Set up event listeners for autocomplete search bars
export async function autocompleteSetup(searchBarOnly, searchBar, friendSearch, searchBarEndpoint) {
    let response;
    if (searchBar) {
        response = await fetch(searchBarEndpoint);
        if (response.ok) {
            const titles = await response.json();
            autocomplete(document.getElementById('title-search'), titles, titleSearch);
        }
    }

    if (!searchBarOnly) {

        if (friendSearch) {
            response = await fetch('/user/friends/allUsernames');
            if (response.ok) {
                const friendList = await response.json();
                autocomplete(document.getElementById('send_friend_username'), friendList, titleSearch);
            }
        }

        response = await fetch('/games/allPlatforms');
        if (response.ok) {
            const platforms = await response.json();
            autocomplete(document.getElementById('platform_filter'), platforms, platformSearch);
        }

        response = await fetch('/games/allFranchises');
        if (response.ok) {
            const franchises = await response.json();
            autocomplete(document.getElementById('franchise_filter'), franchises, franchiseSearch);
        }

        response = await fetch('/games/allCompanies');
        if (response.ok) {
            const companies = await response.json();
            autocomplete(document.getElementById('company_filter'), companies, companySearch);
        }
    }
}

// Fetch game information from server to set up filtering sidebar with options
// Restore any previously selected filters
export async function filterSideBarSetup() {
    let response = await fetch('/games/allGenres');
    let genres = [];
    let release_years = [];
    if (response.ok) {
        genres = await response.json();
        response = await fetch('/games/allReleaseYears');
        if (response.ok) {
            release_years = await response.json();
        }
    }
    
    const genre_div = document.getElementById('genre_filter');
    for (const genre of genres) {
        const genreButton = document.createElement('div');
        genreButton.classList.add('btn', 'filter_buttons');
        genreButton.innerText = genre;
        genreButton.addEventListener('click', () => {filterButtonClick(genreButton, genre, 'genre');});
        genre_div.appendChild(genreButton);
    }
    document.getElementById('genre_filter_clear').addEventListener('click', ()=>{filterHighlightClear(genre_div, 'genre', null);});
    const release_year_div = document.getElementById('release_date_filter');
    for (const year of release_years) {
        const release_year_button = document.createElement('div');
        release_year_button.classList.add('btn','filter_buttons','mar-sm-right','mar-sm-bottom');
        release_year_button.innerText = year;
        release_year_button.addEventListener('click', () => {filterButtonClick(release_year_button, year, 'release_year');});
        release_year_div.insertBefore(release_year_button, release_year_div.firstChild);
    }
    const highestDecade = (release_years[release_years.length-1] - release_years[release_years.length-1]%10);
    const lowestDecade = (release_years[0] - release_years[0]%10);
    for (let decade = highestDecade; decade >= lowestDecade; decade=decade-10) {
        const release_year_button = document.createElement('div');
        release_year_button.classList.add('btn','filter_buttons','mar-sm-right','mar-sm-bottom');
        release_year_button.innerText = decade;
        release_year_button.addEventListener('click', () => {filterButtonClick(release_year_button, decade, 'release_decade');});
        release_year_div.appendChild(release_year_button, release_year_div.firstChild);
    }
    document.getElementById('release-date_filter_clear').addEventListener('click', ()=>{filterHighlightClear(release_year_div, 'release_year', 'release_decade');});
}

// Highlight/un-highlight selected filter (from genre or release date) and add/remove it from filter list
export function filterButtonClick(genreButton, filterValue, type) {
    if (genreButton.style.backgroundColor !== 'steelblue') {
        genreButton.style.backgroundColor = 'steelblue';
        const filterEntry = {'type': type, 'value': filterValue};
        if (!filterContains(filterEntry)) {
            window.filters.push(filterEntry);
        }
    } else {
        genreButton.style.backgroundColor = '#f7f8fa';
        const filterEntry = window.filters.find(filter => {
            return (filter.value === filterValue) && (filter.type === type);
        });
        if (filterEntry) {
            window.filters.splice(window.filters.indexOf(filterEntry), 1);
        }
    }
}

// Remove selected filter button (from platform, franchise, company)
export function filterButtonClickRemove(buttonDiv, button, filterValue, type) {
    buttonDiv.removeChild(button);
    const filterEntry = window.filters.find(filter => {
        return (filter.value === filterValue) && (filter.type === type);
    });
    if (filterEntry) {
        window.filters.splice(window.filters.indexOf(filterEntry), 1);
    }
}

// Clear all filter buttons (on either platform, franchise, company)
export function filterButtonClear(div, type) {
    const filter_buttons = div.getElementsByClassName('filter_buttons');
    const length = filter_buttons.length;
    if (filter_buttons.length > 0) {
        for (let i = 0; i < length; i++) {
            const filterEntry = window.filters.find(filter => {
                return (filter.value === filter_buttons[0].innerText) && (filter.type === type);
            });
            if (filterEntry) {
                window.filters.splice(window.filters.indexOf(filterEntry), 1);
            }
            div.removeChild(filter_buttons[0]);
        }
    }
}

// Clear all filter highlights (on either genre or platform)
export function filterHighlightClear(div, type1, type2) {
    const filter_buttons = div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            const filterEntry = window.filters.find(filter => {
                if (type2 === null) {
                    return (filter.value.toString() === button.innerText) && (filter.type === type1);
                } else {
                    return (filter.value.toString() === button.innerText) && ((filter.type === type1) || (filter.type === type2));
                }
            });
            if (filterEntry) {
                window.filters.splice(window.filters.indexOf(filterEntry), 1);
            }
            button.style.backgroundColor = '#f7f8fa';
        }
    }
}

// Add rating filter (hitting apply button) to list of filters
export function ratingFilterApply() {
    const myRatingButton = document.getElementById('my_ratings');
    const  noRatingButton = document.getElementById('no_ratings');
    if (myRatingButton.checked) {
        const ratingHigh = document.getElementById('max-rating').value;
        const ratingLow = document.getElementById('min-rating').value;
        if (!((ratingHigh <= 5 && ratingHigh >= 1) && (ratingLow <= 5 && ratingLow >= 1))) {
            alert('Must choose rating between 1 and 5 stars');
            return;
        }
        if (ratingLow > ratingHigh) {
            alert('Min rating must be less than Max rating');
            return;
        }

        const oldFilterEntry = window.filters.find(filter => {
            return filter.type === 'rating';
        });
        if (oldFilterEntry) {
            window.filters.splice(window.filters.indexOf(oldFilterEntry), 1);
        }

        const filterEntry = {'type': 'rating', 'value': true, 'value-high': ratingHigh, 'value-low': ratingLow};
        if (!filterContains(filterEntry)) {
            window.filters.push(filterEntry);
        }
    } else if (noRatingButton.checked) {
        const oldFilterEntry = window.filters.find(filter => {
            return filter.type === 'rating';
        });
        if (oldFilterEntry) {
            window.filters.splice(window.filters.indexOf(oldFilterEntry), 1);
        }

        const filterEntry = {'type': 'rating', 'value': false};
        if (!filterContains(filterEntry)) {
            window.filters.push(filterEntry);
        }
    }
    return;
}

// Clear ratings filter
export function ratingFilterClear() {
    const myRatingButton = document.getElementById('my_ratings');
    const  noRatingButton = document.getElementById('no_ratings');
    if (myRatingButton.checked) {
        myRatingButton.checked = false;
        document.getElementById('rating_select_form').style.display = 'none';
    } else if (noRatingButton.checked) {
        noRatingButton.checked = false;
    }
    const filterEntry = window.filters.find(filter => {
        return filter.type === 'rating';
    });
    if (filterEntry) {
        window.filters.splice(window.filters.indexOf(filterEntry), 1);
    }
}

// Shows option to choose max and min ratings if 'My Ratings' is selected, otherwise hides these options
export function showRatingFilter() {
    const ratingButton = document.getElementById('my_ratings');
    if (ratingButton.checked) {
        document.getElementById('rating_select_form').style.display = 'block';
    } else {
        document.getElementById('rating_select_form').style.display = 'none';
    }
}

// Open selected filter tab menu
export function openFilterTab(tab, filterName) {
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


// Add platform search selection to filter list
export function platformSearch(inputDiv, __, word) {
    const platform_filter_div = document.getElementById('applied_platform_filters');
    const filter_buttons = platform_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerText === word) {
                return;
            }
        }
    }
    const platformButton = document.createElement('div');
    platformButton.classList.add('btn', 'filter_buttons', 'mt-2');
    platformButton.innerText = word;
    platformButton.addEventListener('click', () => {filterButtonClickRemove(platform_filter_div, platformButton, word, 'platform');});
    platform_filter_div.appendChild(platformButton);
    
    const filterEntry = {'type': 'platform', 'value': word};
    if (!filterContains(filterEntry)) {
        window.filters.push(filterEntry);
    }
    
    if (inputDiv !== null) {
        closeAllLists(document.getElementById('platform_filter_autocomplete-list').getElementsByTagName('input'), inputDiv);
    }
    document.getElementById('platform_filter').value = '';
}

// Add franchise search selection to filter list
export function franchiseSearch(inputDiv, __, word) {
    const franchise_filter_div = document.getElementById('applied_franchise_filters');
    const filter_buttons = franchise_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerText === word) {
                return;
            }
        }
    }
    const franchiseButton = document.createElement('div');
    franchiseButton.classList.add('btn', 'filter_buttons', 'mt-2');
    franchiseButton.innerText = word;
    franchiseButton.addEventListener('click', () => {filterButtonClickRemove(franchise_filter_div, franchiseButton, word, 'franchise');});
    franchise_filter_div.appendChild(franchiseButton);
    
    const filterEntry = {'type': 'franchise', 'value': word};
    if (!filterContains(filterEntry)) {
        window.filters.push(filterEntry);
    }
    
    if (inputDiv !== null) {
        closeAllLists(document.getElementById('franchise_filter_autocomplete-list').getElementsByTagName('input'), inputDiv);
    }
    document.getElementById('franchise_filter').value = '';
}

// Add company search selection to filter list
export function companySearch(inputDiv, __, word) {
    const company_filter_div = document.getElementById('applied_company_filters');
    const filter_buttons = company_filter_div.getElementsByClassName('filter_buttons');
    if (filter_buttons.length > 0) {
        for (const button of filter_buttons) {
            if (button.innerText === word) {
                return;
            }
        }
    }
    const companyButton = document.createElement('div');
    companyButton.classList.add('btn', 'filter_buttons', 'mt-2');
    companyButton.innerText = word;
    companyButton.addEventListener('click', () => {filterButtonClickRemove(company_filter_div, companyButton, word, 'company');});
    company_filter_div.appendChild(companyButton);

    const filterEntry = {'type': 'company', 'value': word};
    if (!filterContains(filterEntry)) {
        window.filters.push(filterEntry);
    }

    if (inputDiv !== null) {
        closeAllLists(document.getElementById('company_filter_autocomplete-list').getElementsByTagName('input'), inputDiv);
    }
    document.getElementById('company_filter').value = '';
}

export function titleSearch(inputDiv, autocompleteItem, word) {
    //insert the value for the autocomplete text field
    inputDiv.value = word;
    inputDiv.name = autocompleteItem.name; // Set search bar id to game id that corresponds to title
    //close the list of autocompleted values, or any other open lists of autocompleted values
    if (document.getElementById('autocompleteDiv') !== null) {
        closeAllLists(document.getElementById('autocompleteDiv').getElementsByTagName('input'), inputDiv);
    }

}

export async function gameSearch(list) {
    const sortingObj = window.sorting;
    const searchTitle = document.getElementById('title-search').value;
    const gameResponse = await fetch('/game/list/Search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'titleSearch': searchTitle, 'list': list, 'sorting': sortingObj})
    });
    if (gameResponse.ok) {
        const gameSearchResults = await gameResponse.json();

        const filterResponse = await fetch('/user/ratings');
        if (filterResponse.ok) {
            const user_ratings = await filterResponse.json();
            const searchResults = {'gameList': gameSearchResults, 'ratings': user_ratings};
            return searchResults;
        } else {
            return null;
        }      
    } 
    else {
        return null;
    }
}

// Clear all filters
export function clearAllFilters() {
    ratingFilterClear();
    filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');
    filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');
    filterButtonClear(document.getElementById('applied_company_filters'), 'company');
    filterHighlightClear(document.getElementById('genre_filter'), 'genre', null);
    filterHighlightClear(document.getElementById('release_date_filter'), 'release_year', 'release_decade');
    document.getElementById('all_filter_apply').click();
}

export function applySelectedFilters(filterArr, userTable) {
    if (filterArr.length === 0) {
        return false;
    }
    const sortingObj = window.sorting;
    const genreFilterArr = [];
    const platformFilterArr = [];
    const franchiseFilterArr = [];
    const companyFilterArr = [];
    let ratingsFilterObj = {};
    const releaseYearFilterArr = [];
    const releaseDecadeFilterArr = [];
    for (const filter of filterArr) {
        if (filter.type === 'genre'){
            genreFilterArr.push(filter.value);
        } else if (filter.type === 'platform') {
            platformFilterArr.push(filter.value);
        } else if (filter.type === 'franchise') {
            franchiseFilterArr.push(filter.value);
        } else if (filter.type === 'company') {
            companyFilterArr.push(filter.value);
        }else if (filter.type === 'release_year') {
            releaseYearFilterArr.push(filter.value);
        } else if (filter.type === 'release_decade') {
            releaseDecadeFilterArr.push(filter.value);
        } else if (filter.type === 'rating') {
            ratingsFilterObj = filter;
        }
    }
    return {'genre':genreFilterArr, 'platform': platformFilterArr, 'franchise': franchiseFilterArr, 'company': companyFilterArr, 'release_year': releaseYearFilterArr, 'release_decade':releaseDecadeFilterArr, 'rating': ratingsFilterObj, 'sorting': sortingObj, 'userTableType': userTable};
}

// Performs autocompletion and handles selection of autocompletion input
export function autocomplete(inputDiv, arr, func) {
    inputDiv.addEventListener('input', function() {
        const searchVal = inputDiv.value;
        const autocompleteDivName = inputDiv.id + '_autocomplete-list';

        if (document.getElementById(autocompleteDivName) !== null) {
            //close any already open lists of autocompleted values
            closeAllLists(document.getElementById(autocompleteDivName).getElementsByTagName('input'), inputDiv);
        }

        if (!searchVal) { 
            return false;
        }

        //create a DIV element that will contain the autocomplete suggestions:
        const autocompleteDiv = document.createElement('div');
        autocompleteDiv.setAttribute('id', autocompleteDivName);
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
            //create a DIV element for each matching element
            const autocompleteItem = document.createElement('div');
            autocompleteItem.id = counter;
            counter++;
            //make the matching letters bold
            autocompleteItem.innerHTML = "<strong>" + word.substr(0, searchVal.length) + "</strong>";
            autocompleteItem.innerHTML += word.substr(searchVal.length);
            //insert a input field that will hold the current array item's value
            autocompleteItem.innerHTML += "<input type='hidden' value='" + word + "'>";
            if (typeof(arr[i]) === 'object') {
                autocompleteItem.name = arr[i].gameID;
            } else {
                autocompleteItem.name = arr[i];
            }
            //execute a function when someone clicks on the item value (DIV element)
            autocompleteItem.addEventListener("click", () => {
                func(inputDiv, autocompleteItem, word);
            });
            autocompleteDiv.appendChild(autocompleteItem);
          }
        }
        return true;
    });
}

//close all autocomplete lists in the document, except the one passed as an argument
export function closeAllLists(elmnt, inp) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

// Contains function for window.filters
function filterContains(obj) {
    for (const filter of window.filters) {
        if (JSON.stringify(filter) === JSON.stringify(obj)){
            return true;
        }
    }
    return false;
}