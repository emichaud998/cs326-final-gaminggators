'use strict';
import {postData} from './utils.js'

const url = 'http://localhost:8080';

window.addEventListener("load", async function () {
  document.getElementById('signin-btn').addEventListener('click', () => {
    // get input
    const username = document.getElementById('username-form').value;
    const password = document.getElementById('password-form').value;
    console.log(email)
    // send login request
    postData(`${url}/user/login`, {'username': username,'password': password})
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
        // Check browser support
        if (typeof(Storage) !== "undefined") {
          const { userID } = data;
          // Store
          localStorage.setItem("username", username);
          localStorage.setItem("userID", userID);
        } else {
          alert("Sorry, your browser does not support Web Storage...");
        }
        console.log(data);
        alert(JSON.stringify(data));
      })
      .catch(error => console.log('error is', error));
  });
});

function processAjaxData(response, urlPath){
  document.getElementById("content").innerHTML = response.html;
  document.title = response.pageTitle;
  window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}