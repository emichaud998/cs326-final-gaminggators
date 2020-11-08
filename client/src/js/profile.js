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
    document.getElementById('resetusername').addEventListener('click' , () => resetUsername(profile.id, profile.username));
    document.getElementById('resetpassword').addEventListener('click' , () => resetPassword(profile.id));

}

async function resetUsername(id, oldusername)
{
    const newusername = document.getElementById('username').value.toString();

    const resetUNResponse = await fetch(url+'/user/username/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: id, oldUsername: oldusername, newUsername: newusername})
    });    

    if(resetUNResponse.ok)
    {
        document.getElementById('usernameheader').innerHTML = newusername;
    }
    else
    {
        alert('Username reset failed!');
    }
}

async function resetPassword(id)
{
    const newpassword = document.getElementById('password').value.toString();

    const resetPassResponse = await fetch(url+'/user/password/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: id, newPassword: newpassword})
    }); 

    if(!resetPassResponse.ok)
    {
        alert('Password reset failed!');
    }
}

async function updateProfPic(id)
{
    const profileURL = document.getElementById('updateprofpic').value.toString();

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