const url = 'http://localhost:8080';
const currentUserID = '1111';

window.addEventListener('load', loadProfile());

function loadProfile()
{
    fetchProfile();
}

async function fetchProfile()
{

    //Display Username, Profile Picture, and add functionality to buttons

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
    document.getElementById('addfriend').addEventListener('click', () => addFriend(profile.id));

    //Display Rating Stats

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

    //Create Friend's List

    const friendListResponse = await fetch(url+'/user/friends', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: profile.id})
    });
    const friendList = await friendListResponse.json();

    if(friendList.length !== 0)
    {

        for(let i = 0; i < friendList.length; i++)
        {
            const friendID = friendList[i];

            //Get friend username
            const friendUNResponse = await fetch(url+'/user/username', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: friendID})
            });
            const friendUsername = await friendUNResponse.json();

            //Get friend profile picture
            const friendPicResponse = await fetch(url+'/user/profilepicture', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: friendID})
            });
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
            removeFriendButton.addEventListener('click', () => removeFriend(profile.id, friendID));
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

async function addFriend(id)
{
    const newFriendUsername = document.getElementById('friendusername').value;

    const friendIDResponse = await fetch(url+'/user/userID', 
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


    const addFriendResponse = await fetch(url+'/user/friends/add', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: id, friendID: newFriendID})
    });
    
    if(addFriendResponse.ok)
    {
        alert('Friend successfully added!');

        if(document.getElementById('nofriendsdiv') !== null)
        {
            document.getElementById('FriendListContainer').removeChild(document.getElementById('nofriendsdiv'));
        }    

        //Get Profile Picture
        const friendPicResponse = await fetch(url+'/user/profilepicture', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userID: newFriendID})
        });
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
        removeFriendButton.addEventListener('click', () => removeFriend(id, newFriendID));
        friendDiv.appendChild(removeFriendButton);

        document.getElementById('FriendListContainer').appendChild(friendDiv);

    }
    else
    {
        alert('Friend could not be added');
    }
}

async function removeFriend(userid, friendid)
{
    document.getElementById('FriendListContainer').removeChild(document.getElementById(friendid));

    const remFriendResponse = await fetch(url+'/user/friends/remove', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: userid, friendID: friendid})
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

function getRatingStats(ratings)
{
    if(ratings.length === 0){return -1;}

    const ratingObj = {};
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