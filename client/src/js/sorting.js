'use strict';

// Function for sorting by title
export function sortTitle(elem) {
    if (elem) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Ascending)';
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Descending)';
    }
}

// Function for sorting by rating
export function sortRating(elem) {
    if (elem) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Rating (Ascending)';
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Rating (Descending)'; 
    }
}

// Function for sorting by release date
export function sortReleaseDate(elem) {
    if (elem) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Ascending)';
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Descending)';
    }
}

// Function for sorting by default (hitting clear sort)
export function sortDefault() {
    document.getElementById('sorting_info').innerText = 'Sorting by: Default';
}