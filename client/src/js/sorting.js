'use strict';

// Function for sorting by title
export async function sortTitle(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Ascending)';
        window.sorting = {'sortBy': 'title', 'order': 'asc'};
        
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Descending)'; 
        window.sorting = {'sortBy': 'title', 'order': 'desc'};
    }
    return null;
}

// Function for sorting by rating
export function sortPopularity(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Popularity (Ascending)';
        window.sorting = {'sortBy': 'popularity', 'order': 'asc'};
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Popularity (Descending)';
        window.sorting = {'sortBy': 'popularity', 'order': 'desc'}; 
    }
}

// Function for sorting by release date
export function sortReleaseDate(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Ascending)';
        window.sorting = {'sortBy': 'release_date', 'order': 'asc'};
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Descending)';
        window.sorting = {'sortBy': 'release_date', 'order': 'desc'};
    }
}