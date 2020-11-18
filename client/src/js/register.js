'use strict';
import {postData} from './utils.js';

window.addEventListener("load", function () {
  // send register request
  document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('email-form').value;
    const username = document.getElementById('username-form').value;
    const password = document.getElementById('password-form').value;
    postData('/user/register', {'email': email,'username': username,'password': password})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if(response.status === 409) {
          alert('Username/Email already in use');
          return Promise.reject('error 409');
        } else {
          console.log(response.statusText);
          return Promise.reject('some other error: ' + response.status);
        }
      })
      .then(data => {
        alert(JSON.stringify(data));
        // Redirect to sign in page
        window.location.replace('/signin.html');
      })
      .catch(error => console.log('error is', error));
  });
});