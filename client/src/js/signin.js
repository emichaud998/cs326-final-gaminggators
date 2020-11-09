'use strict';
import {postData} from 'utils.js'

const url = 'http://localhost:8080';

window.addEventListener("load", async function () {
  document.getElementById('signin-btn').addEventListener('click', () => {
    // get input
    const username = document.getElementById('username-form');
    const password = document.getElementById('password-form');
    postData(`${url}/user/login`, {'username': username,'password': password})
      .then(response => {
        const status = response.status;
        const data = response.json();
        console.log(response.status);
        console.log(response.json());
        alert(data)
        if (status === 200) {
          // Check browser support
          if (typeof(Storage) !== "undefined") {
            const { userID } = data;
            // Store
            localStorage.setItem("username", username);
            localStorage.setItem("userID", userID);
          } else {
            alert("Sorry, your browser does not support Web Storage...");
          }
        }
      });
  });
});

function processAjaxData(response, urlPath){
  document.getElementById("content").innerHTML = response.html;
  document.title = response.pageTitle;
  window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}