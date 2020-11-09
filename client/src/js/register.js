'use strict';
import {postData} from './utils.js'

const url = 'https://gamer-port.herokuapp.com';

window.addEventListener("load", async function () {
  // get input
  const email = document.getElementById('email-form').value;
  const username = document.getElementById('username-form').value;
  const password = document.getElementById('password-form').value;
  // send register request
  document.getElementById('register-btn').addEventListener('click', () => {
    postData(`${url}/user/register`, {'email': email,'username': username,'password': password})
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then(data => {
        alert(JSON.stringify(data));
        // Check browser support
        if (typeof(Storage) !== "undefined") {
          const { userID } = data;
          // Store current user
          localStorage.setItem("username", username);
        } else {
          alert("Sorry, your browser does not support Web Storage...");
        }
        // Redirect to profile page
        window.location.replace("/profile.html");
      })
      .catch(error => console.log('error is', error));
  });
});