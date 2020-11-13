'use strict';
const userID = '1111';

// Function for sorting by title
export async function sortTitle(order, endpoint) {
    const sortedResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'ordering': order, 'userID':userID})
    });
    if (sortedResponse.ok) {
        const filterList = await sortedResponse.json();
        const ratingResponse = await fetch('/user/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'userID':userID})
        });
        if (ratingResponse.ok) {
            const user_ratings = await ratingResponse.json();
            const filterResults = {'gameList': filterList, 'ratings': user_ratings};

            if (order) {
                const sortDiv = document.getElementById('sorting_info');
                sortDiv.innerText = 'Sorting by: Title (Ascending)';
                
            } else {
                document.getElementById('sorting_info').innerText = 'Sorting by: Title (Descending)'; 
            }

            return filterResults;
        }
    }
    return null;
}

// Function for sorting by rating
export function sortRating(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Rating (Ascending)';
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Rating (Descending)'; 
    }
}

// Function for sorting by release date
export function sortReleaseDate(order) {
    if (order) {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Ascending)';
    } else {
        document.getElementById('sorting_info').innerText = 'Sorting by: Release Date (Descending)';
    }
}