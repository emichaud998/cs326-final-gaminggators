'use strict';
import {postData} from './utils.js';

window.addEventListener("load", async function () {
  // send register request
  document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('email-form').value;
    const username = document.getElementById('username-form').value;
    const password = document.getElementById('password-form').value;
    postData('/user/register', {'email': email,'username': username,'password': password})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if(response.status === 404) {
          return Promise.reject('error 404');
        } else {
          return Promise.reject('some other error: ' + response.status);
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
        // Redirect to sign in page
        window.location.href('/signin.html');
      })
      .catch(error => console.log('error is', error));
  });
});