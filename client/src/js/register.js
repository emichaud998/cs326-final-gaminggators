'use strict';
import {postData} from './utils.js'

const url = 'http://localhost:8080';

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
        console.log(data);
        alert(JSON.stringify(data));
        // Redirect to profile page
        window.location.replace("/profile.html");
      })
      .catch(error => console.log('error is', error));
  });
});