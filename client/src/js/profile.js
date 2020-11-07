const url = 'http://localhost:8080';
const currentUserID = '1111';

window.addEventListener('load', loadProfile());

function loadProfile()
{
    fetchProfile();


}

async function fetchProfile()
{
    const profileResponse = await fetch(url+'/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: currentUserID})
    });
    const profile = await profileResponse.json();
    document.getElementById('usernameheader').innerHTML = profile.username;

    const image = document.createElement('img');
    image.classList.add('profilepic');
    image.src = profile.profilePicture;
    image.alt="profile picture";
    document.getElementById('profilepicture').appendChild(image);
}