'use strict';
import {postData} from './utils.js';

window.addEventListener("load", async function () {
  document.getElementById('signin-btn').addEventListener('click', () => {
    // get input
    const username = document.getElementById('username-form').value;
    const password = document.getElementById('password-form').value;
    // send login request
    postData('/user/login', {'username': username,'password': password})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(`Error ${response.status}: ${JSON.stringify(response)}`);
        }
      })
      .then(data => {
        alert(JSON.stringify(data));
        // Check browser support
        if (typeof(Storage) !== "undefined") {
          // store current user
          localStorage.setItem("username", username);
        } else {
          alert("Sorry, your browser does not support Web Storage...");
        }
        // Redirect to profile page
        window.location.href('/private/dashboard.html');
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  });
});