'use strict';

// Function for sorting by title
export async function sortTitle(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Ascending)';
        window.sorting = {'sortBy': 'name', 'order': 'ASC'};
        
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Title (Descending)'; 
        window.sorting = {'sortBy': 'name', 'order': 'DESC'};
    }
    return;
}

// Function for sorting by rating
export function sortPopularity(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Popularity (Ascending)';
        window.sorting = {'sortBy': 'rating_count', 'order': 'ASC'};
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Popularity (Descending)';
        window.sorting = {'sortBy': 'rating_count', 'order': 'DESC'}; 
    }
    return;
}

// Function for sorting by release date
export function sortReleaseDate(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Ascending)';
        window.sorting = {'sortBy': 'release_date', 'order': 'ASC'};
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Descending)';
        window.sorting = {'sortBy': 'release_date', 'order': 'DESC'};
    }
    return;
}