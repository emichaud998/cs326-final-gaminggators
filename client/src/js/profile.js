const url = 'http://localhost:8080';
const currentUserID = '1111';

window.addEventListener('load', loadProfile());

function loadProfile()
{
    fetchProfile();
}

async function fetchProfile()
{
    const profileResponse = await fetch(url+'/user/profile', 
    {
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
    image.alt='profile picture';
    image.id='profpic';
    document.getElementById('profilepicture').appendChild(image);

    document.getElementById('updateprofpicbutton').addEventListener('click' , () => updateProfPic(profile.id));

}

async function updateProfPic(id)
{
    const profileURL = document.getElementById('updateprofpic').value.toString();

    console.log(id);
    console.log(url);

    const profPicResponse = await fetch(url+'/user/profilepicture/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: id, profilePicture: profileURL})
    });

    if(profPicResponse.ok)
    {
        document.getElementById('profpic').src = profileURL;
    }
    else
    {
        alert('Picture URL is not valid!');
    }
}