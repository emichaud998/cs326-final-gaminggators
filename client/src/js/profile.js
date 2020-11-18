'use strict';

import {getRatingStats} from './helpers.js';


window.addEventListener('load', loadProfile());

function loadProfile()
{
    fetchProfile();
}

async function fetchProfile()
{

    //Display Username, Profile Picture, and add functionality to buttons

    const profileResponse = await fetch('/user/profile');

    if (!profileResponse.ok) {
        alert('Error retrieving user profile information.');
        return;
    }

    const profile = await profileResponse.json();

    document.getElementById('usernameheader').innerHTML = profile.username;

    const image = document.createElement('img');
    image.classList.add('profilepic');
    image.src = profile.profilePicture;
    image.alt='profile picture';
    image.id='profpic';
    document.getElementById('profilepicture').appendChild(image);

    document.getElementById('updateprofpicbutton').addEventListener('click' , () => updateProfPic());
    document.getElementById('resetusername').addEventListener('click' , () => resetUsername());
    document.getElementById('resetpassword').addEventListener('click' , () => resetPassword());
    document.getElementById('addfriend').addEventListener('click', () => addFriend());

    //Display Rating Stats

    const ratingsResponse = await fetch('/user/ratings');

    if (!ratingsResponse.ok) {
        alert('Error retrieving user rating information.');
        return;
    }

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

    //Create Friend's List

    const friendListResponse = await fetch('/user/friends');

    if (!friendListResponse.ok) {
        alert('Error retrieving user friend list information.');
        return;
    }

    const friendList = await friendListResponse.json();

    if(friendList.length !== 0)
    {

        for(let i = 0; i < friendList.length; i++)
        {
            const friendID = friendList[i].friendID;

            //Get friend username
            const friendUNResponse = await fetch('/user/username', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: friendID})
            });

            if (!friendUNResponse.ok) {
                alert('Error retrieving user friend username.');
                return;
            }

            const friendUsername = await friendUNResponse.json();

            //Get friend profile picture
            const friendPicResponse = await fetch('/user/profilepicture', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: friendID})
            });

            if (!friendPicResponse.ok) {
                alert('Error retrieving user friend profile picture.');
                return;
            }

            const friendProfPic = await friendPicResponse.json();

            //Display Friend Information
            const friendDiv = document.createElement('div');
            friendDiv.classList.add('centerfriendlist');
            friendDiv.id = friendID;

            const friendIMG = document.createElement('img');
            friendIMG.classList.add('friendprofilepic', 'mr-4');
            friendIMG.src = friendProfPic;
            friendIMG.alt='friend profile picture';
            friendDiv.appendChild(friendIMG);

            const friendLabel = document.createElement('label');
            friendLabel.classList.add('friendUNWidth');
            friendLabel.innerHTML = friendUsername;
            friendDiv.appendChild(friendLabel);

            const removeFriendButton = document.createElement('button');
            removeFriendButton.classList.add('btn', 'btn-danger', 'btn-sm', 'buttoncenter', 'ml-4');
            removeFriendButton.innerHTML = 'Remove Friend';
            removeFriendButton.addEventListener('click', () => removeFriend(friendID));
            friendDiv.appendChild(removeFriendButton);

            document.getElementById('FriendListContainer').appendChild(friendDiv);
            
        }
    }
    else
    {
        const nofriendsdiv = document.createElement('div');
        nofriendsdiv.id = 'nofriendsdiv';
        nofriendsdiv.classList.add('centerfriendlist', 'mb-4');
        nofriendsdiv.innerHTML = 'Looks like you have no friends! 😭 Try searching for someone below!';
        document.getElementById('FriendListContainer').appendChild(nofriendsdiv);
    }
}

async function addFriend()
{
    const newFriendUsername = document.getElementById('friendusername').value;

    const friendIDResponse = await fetch('/user/userID', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: newFriendUsername})
    });

    if(!friendIDResponse.ok)
    {
        alert('No user with that username!');
        return;
    }
    const newFriendID = await friendIDResponse.json();


    const addFriendResponse = await fetch('/user/friends/add', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({friendID: newFriendID})
    });
    
    if(addFriendResponse.ok)
    {
        alert('Friend successfully added!');

        if(document.getElementById('nofriendsdiv') !== null)
        {
            document.getElementById('FriendListContainer').removeChild(document.getElementById('nofriendsdiv'));
        }    

        //Get Profile Picture
        const friendPicResponse = await fetch('/user/profilepicture', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userID: newFriendID})
        });

        if (!friendPicResponse.ok) {
            alert('Error retrieving user friend profile picture.');
            return;
        }
        
        const friendProfPic = await friendPicResponse.json();

        //Add to friend list

        const friendDiv = document.createElement('div');
        friendDiv.classList.add('centerfriendlist');
        friendDiv.id = newFriendID;

        const friendIMG = document.createElement('img');
        friendIMG.classList.add('friendprofilepic', 'mr-4');
        friendIMG.src = friendProfPic;
        friendIMG.alt='friend profile picture';
        friendDiv.appendChild(friendIMG);

        const friendLabel = document.createElement('label');
        friendLabel.classList.add('friendUNWidth');
        friendLabel.innerHTML = newFriendUsername;
        friendDiv.appendChild(friendLabel);

        const removeFriendButton = document.createElement('button');
        removeFriendButton.classList.add('btn', 'btn-danger', 'btn-sm', 'buttoncenter', 'ml-4');
        removeFriendButton.innerHTML = 'Remove Friend';
        removeFriendButton.addEventListener('click', () => removeFriend(newFriendID));
        friendDiv.appendChild(removeFriendButton);

        document.getElementById('FriendListContainer').appendChild(friendDiv);

    }
    else
    {
        alert('Friend could not be added');
    }
}

async function removeFriend(friendid)
{
    document.getElementById('FriendListContainer').removeChild(document.getElementById(friendid));

    const remFriendResponse = await fetch('/user/friends/remove', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({friendID: friendid})
    });

    if(!remFriendResponse.ok)
    {
        alert('Error: Friend was not removed!');
    }

    if(!document.getElementById('FriendListContainer').hasChildNodes())
    {
        const nofriendsdiv = document.createElement('div');
        nofriendsdiv.id = 'nofriendsdiv';
        nofriendsdiv.classList.add('centerfriendlist', 'mb-4');
        nofriendsdiv.innerHTML = 'Looks like you have no friends! 😭 Try searching for someone below!';
        document.getElementById('FriendListContainer').appendChild(nofriendsdiv);
    }
}

async function resetUsername()
{
    const newusername = document.getElementById('username').value.toString();

    const resetUNResponse = await fetch('/user/username/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newUsername: newusername})
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

async function resetPassword()
{
    const newpassword = document.getElementById('password').value.toString();

    const resetPassResponse = await fetch('/user/password/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword: newpassword})
    }); 

    if(!resetPassResponse.ok)
    {
        alert('Password reset failed!');
    }
    else {
        alert('Password reset successful!');
    }
}

async function updateProfPic()
{
    const profileURL = document.getElementById('updateprofpic').value.toString();

    const profPicResponse = await fetch('/user/profilepicture/update', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({profilePicture: profileURL})
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