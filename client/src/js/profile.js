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

    const ratingsResponse = await fetch(url+'/user/ratings', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: profile.id})
    });
    const ratings = await ratingsResponse.json();

    const ratingStats = getRatingStats(ratings);

    if(ratingStats !== -1)
    {
        document.getElementById('numrated').innerHTML = 'Rated Games : ' + ratings.length;

        document.getElementById('5star').innerHTML = '5-Star Games : ' + ratingStats.fivestar;
        document.getElementById('4star').innerHTML = '4-Star Games : ' + ratingStats.fourstar;
        document.getElementById('3star').innerHTML = '3-Star Games : ' + ratingStats.threestar;
        document.getElementById('2star').innerHTML = '2-Star Games : ' + ratingStats.twostar;
        document.getElementById('1star').innerHTML = '1-Star Games : ' + ratingStats.onestar;
    }
}

function getRatingStats(ratings)
{
    if(ratings.length === 0){return -1;}

    let ratingObj = {};
    ratingObj.onestar = 0;
    ratingObj.twostar = 0;
    ratingObj.threestar = 0;
    ratingObj.fourstar = 0;
    ratingObj.fivestar = 0;

    for(let i = 0; i < ratings.length; i++)
    {
        if(ratings[i].rating === 1)
        {
            ratingObj.onestar++;
        }
        else if(ratings[i].rating === 2)
        {
            ratingObj.twostar++;
        }
        else if(ratings[i].rating === 3)
        {
            ratingObj.threestar++;
        }
        else if(ratings[i].rating === 4)
        {
            ratingObj.fourstar++;
        }
        else if(ratings[i].rating === 5)
        {
            ratingObj.fivestar++;
        }
    }

    return ratingObj;
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